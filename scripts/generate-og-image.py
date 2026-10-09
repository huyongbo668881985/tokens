"""Render the static sharing cover. Optional tooling: Python 3 + Pillow.

The committed PNG is served directly; deployments do not run this script.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2
WIDTH, HEIGHT = 1200, 630


def font(size, bold=False):
    candidates = (
        ["/System/Library/Fonts/Supplemental/Arial Bold.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
        if bold else
        ["/System/Library/Fonts/Supplemental/Arial.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    )
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size * SCALE)
    raise RuntimeError("Install Arial or DejaVu Sans to regenerate the cover.")


image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE))
draw = ImageDraw.Draw(image)
for y in range(HEIGHT * SCALE):
    t = y / (HEIGHT * SCALE)
    draw.line((0, y, WIDTH * SCALE, y),
              fill=(int(11 + 4 * t), int(18 + 5 * t), int(32 + 10 * t)))


def rect(box, fill, radius=0, outline=None):
    draw.rounded_rectangle(tuple(int(v * SCALE) for v in box),
                           radius=radius * SCALE, fill=fill, outline=outline,
                           width=2 * SCALE)


def text(x, y, label, size, color, bold=False):
    draw.text((x * SCALE, y * SCALE), label,
              font=font(size, bold), fill=color)


for x in range(780, 1200, 40):
    draw.line((x * SCALE, 0, x * SCALE, HEIGHT * SCALE), fill="#172439")
for y in range(0, HEIGHT, 40):
    draw.line((780 * SCALE, y * SCALE, WIDTH * SCALE, y * SCALE), fill="#172439")

rect((60, 52, 104, 96), "#103c36", 12)
text(68, 56, "{ }", 23, "#34d399", True)
text(119, 62, "TOOLS FOR AI DEVELOPERS", 18, "#94a3b8", True)
text(60, 155, "LLM Token", 70, "#f8fafc", True)
text(60, 235, "Cost Calculator", 65, "#34d399", True)
text(63, 328, "Estimate tokens. Compare API costs.", 25, "#cbd5e1")

rect((60, 389, 659, 452), "#142638", 14, "#25465a")
text(82, 406, "{ }", 26, "#67e8f9", True)
text(143, 406, "Tool Schema Validator", 26, "#e2e8f0", True)

x = 60
for label in ["OpenAI", "Anthropic", "Gemini", "DeepSeek"]:
    w = int(draw.textlength(label, font=font(16)) / SCALE) + 30
    rect((x, 489, x + w, 526), "#182538", 10)
    text(x + 15, 498, label, 16, "#cbd5e1")
    x += w + 10

rect((770, 126, 1137, 490), "#111d2f", 22, "#30425a")
text(794, 153, "PROMPT / SCHEMA", 14, "#94a3b8", True)
rect((794, 187, 1113, 274), "#0b1423", 12)
text(814, 204, '{ "type": "function",', 19, "#67e8f9")
text(814, 238, '  "parameters": { ... } }', 19, "#94a3b8")
text(794, 302, "TOKEN ESTIMATE", 14, "#94a3b8", True)
for y, w, color in [(337, 286, "#34d399"), (360, 203, "#22d3ee"),
                    (383, 252, "#818cf8")]:
    rect((794, y, 1113, y + 10), "#24344b", 5)
    rect((794, y, 794 + w, y + 10), color, 5)
rect((794, 423, 1113, 465), "#103c36", 9)
text(814, 435, "VALID JSON", 16, "#6ee7b7", True)

draw.line((60 * SCALE, 563 * SCALE, 1137 * SCALE, 563 * SCALE),
          fill="#26364b", width=SCALE)
text(60, 583, "LOCAL PROCESSING  /  NO API KEY REQUIRED", 15, "#94a3b8")
image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(
    ROOT / "og-image.png", optimize=True)
print(ROOT / "og-image.png")
