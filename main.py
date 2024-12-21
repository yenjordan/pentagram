import modal
import io
from fastapi import Response, HTTPException, Query, Request
from datetime import datetime, timezone
import requests
import os

app = modal.App()


@app.function(secrets=[modal.Secret.from_name("custom-secret")])
def f():
    print(os.environ["CLIENT_TOKEN_1"])


def download_model():
    from diffusers import AutoPipelineForText2Image
    import torch
    
    AutoPipelineForText2Image.from_pretrained(
        "stabilityai/sdxl-turbo",
        torch_dtype=torch.float16,
        variant="fp16",
        secrets=[modal.Secret.from_name("custom-secret")],
    )

image = (modal.Image.debian_slim()
         .pip_install("fastapi[standard]", "transformers", "accelerate", "diffusers", "requests")
         .run_function(download_model))

app = modal.App("sd-demo", image=image)

@app.cls(
    image=image,
    gpu="A10G",
    container_idle_timeout=300,
    secrets=[modal.Secret.from_name("custom-secret")]
)

class Model:


    @modal.build()
    @modal.enter()

    def load_weights(self):
        from diffusers import AutoPipelineForText2Image
        import torch

        self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,
            variant="fp16",
        )

        self.pipe.to("cuda")
        self.API_KEY = os.environ["CLIENT_TOKEN_1"]

    @modal.web_endpoint()
    def generate(self, request: Request, prompt: str = Query(..., description="The prompt for image generation")):
        
        api_key = request.headers.get("X-API-KEY")

        if api_key != self.CLIENT_TOKEN_1:
            raise HTTPException(status_code=401, detail="Unauthorized")

        image = self.pipe(prompt, num_inference_steps=1, guidance_scale=0.0).images[0]

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")

        return Response(content=buffer.getvalue(), media_type="image/jpeg")
    
    @modal.web_endpoint()
    def health(self):
            """Lightweight endpoint for keeping the container warm"""
            return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}
    
@app.function(
    schedule=modal.Cron("*/5 * * * *"),
    secrets=[modal.Secret.from_name("custom-secret")]
)

def keep_warm():
    health_url = "https://jordan--sd-demo.model.health.modal.run/health"
    generate_url = "https://jordan--sd-demo.model.generate.modal.run/generate"

    health_response = requests.get(health_url)
    print(f"Health check at: {health_response.json()['timestamp']}")

    headers = {"X-API-KEY": os.environ["custom-secret"]}
    generate_response = requests.get(generate_url, headers=headers)
    print(f"Generate endpoint tested successfully at: {datetime.now(timezone.utc).isoformat()}")
