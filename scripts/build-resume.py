#!/usr/bin/env python3
"""
Generate a placeholder resume PDF from the canonical profile JSON.

Reads:  data/profile.json
Writes: public/resume.pdf

Replace public/resume.pdf with a hand-tuned version any time — this script
just gives the site a downloadable file so the hero/contact CTAs are not 404
on a fresh deploy.
"""

import json
from pathlib import Path

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import (
        SimpleDocTemplate,
        Paragraph,
        Spacer,
        HRFlowable,
        KeepTogether,
    )
except ImportError:
    raise SystemExit("reportlab not installed — `pip install reportlab`")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "profile.json"
OUT = ROOT / "public" / "resume.pdf"

data = json.loads(SRC.read_text())
profile = data["profile"]
experience = data["experience"]
education = data["education"]
clusters = data["skillClusters"]

INK = HexColor("#0B0D10")
MUTED = HexColor("#525B6D")
ACCENT = HexColor("#9A6A1F")  # darker amber for print readability

styles = getSampleStyleSheet()

NAME = ParagraphStyle(
    "Name",
    fontName="Times-Bold",
    fontSize=22,
    leading=24,
    textColor=INK,
    spaceAfter=2,
)
HEADLINE = ParagraphStyle(
    "Headline",
    fontName="Times-Italic",
    fontSize=12,
    leading=14,
    textColor=ACCENT,
    spaceAfter=4,
)
META = ParagraphStyle(
    "Meta",
    fontName="Helvetica",
    fontSize=9,
    leading=11,
    textColor=MUTED,
    spaceAfter=8,
)
SUMMARY = ParagraphStyle(
    "Summary",
    fontName="Helvetica",
    fontSize=10,
    leading=13.5,
    textColor=INK,
    spaceAfter=10,
    alignment=TA_LEFT,
)
SECTION = ParagraphStyle(
    "Section",
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=11,
    textColor=ACCENT,
    spaceAfter=3,
    spaceBefore=10,
)
ROLE = ParagraphStyle(
    "Role",
    fontName="Times-Bold",
    fontSize=11,
    leading=13,
    textColor=INK,
)
ROLE_META = ParagraphStyle(
    "RoleMeta",
    fontName="Helvetica-Oblique",
    fontSize=9,
    leading=11,
    textColor=MUTED,
    spaceAfter=3,
)
BODY = ParagraphStyle(
    "Body",
    fontName="Helvetica",
    fontSize=9.5,
    leading=12.5,
    textColor=INK,
    spaceAfter=2,
    leftIndent=10,
    bulletIndent=0,
)


def hr():
    return HRFlowable(
        width="100%", thickness=0.5, color=HexColor("#C8C2B4"), spaceBefore=4, spaceAfter=4
    )


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title=f"{profile['name']} — Resume",
        author=profile["name"],
    )

    story = []

    # --- Header ---
    story.append(Paragraph(profile["name"].upper(), NAME))
    story.append(Paragraph(profile["headline"], HEADLINE))
    story.append(
        Paragraph(
            f"{profile['location']} &nbsp;·&nbsp; "
            f"<a href=\"mailto:{profile['email']}\" color=\"#525B6D\">{profile['email']}</a> &nbsp;·&nbsp; "
            f"{profile['phone']} &nbsp;·&nbsp; "
            f"<a href=\"https://{profile['linkedin']}\" color=\"#525B6D\">{profile['linkedin']}</a>",
            META,
        )
    )
    story.append(hr())

    # --- Summary ---
    story.append(Paragraph("SUMMARY", SECTION))
    story.append(Paragraph(profile["summary"], SUMMARY))

    # --- Experience ---
    story.append(Paragraph("EXPERIENCE", SECTION))
    for role in experience:
        chunk = []
        # The Independent Consultant entry uses the same string for company
        # and title; collapse to a single line in that case.
        if role["company"] == role["title"] or role["company"] in role["title"]:
            chunk.append(Paragraph(role["title"], ROLE))
        else:
            chunk.append(Paragraph(f"{role['title']} — {role['company']}", ROLE))
        chunk.append(
            Paragraph(
                f"{role['startLabel']} – {role['endLabel']} &nbsp;·&nbsp; {role['location']}",
                ROLE_META,
            )
        )
        # Cap to top 3 achievements per role for a 1-pager. Sorted by source order
        # (which matches the editorial priority in the database).
        for ach in role["achievements"][:3]:
            text = ach["text"]
            chunk.append(Paragraph(f"• {text}", BODY))
        chunk.append(Spacer(1, 6))
        story.append(KeepTogether(chunk))

    # --- Skills ---
    story.append(Paragraph("CAPABILITIES", SECTION))
    for c in clusters:
        names = ", ".join(s["name"] for s in c["skills"])
        story.append(
            Paragraph(
                f"<b>{c['cluster']}.</b> {names}",
                ParagraphStyle(
                    "Cluster",
                    parent=BODY,
                    leftIndent=0,
                    spaceAfter=3,
                ),
            )
        )

    # --- Education ---
    if education:
        story.append(Paragraph("EDUCATION", SECTION))
        for ed in education:
            story.append(
                Paragraph(
                    f"<b>{ed['degree']}</b> — {ed['school']}, {ed['location']} "
                    f"<font color=\"#525B6D\">({ed['startLabel']} – {ed['endLabel']})</font>",
                    ParagraphStyle("Ed", parent=BODY, leftIndent=0),
                )
            )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)
    print(f"✓ Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
