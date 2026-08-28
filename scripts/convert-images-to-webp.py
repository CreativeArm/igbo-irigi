from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
UPLOADS = ROOT / "uploads"
MAX_EDGE = 1920

for source in UPLOADS.glob("*.jpg"):
    target = source.with_suffix(".webp")
    if target.exists():
        continue
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=82, method=6)
        print(f"{source.name} -> {target.name} ({image.width}x{image.height})")
