"""Extract usable title glyphs from the manual and prepare complete Montserrat."""
from io import BytesIO
from pathlib import Path
import sys
import urllib.request
from pypdf import PdfReader
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont
from title_font import prepare_titles

dest = Path(__file__).resolve().parents[1] / 'public/fonts'
reader = PdfReader(sys.argv[1])
embedded = None
for page in reader.pages:
    for ref in (page.get('/Resources', {}).get('/Font', {}) or {}).values():
        font = ref.get_object()
        for item in [font] + [r.get_object() for r in font.get('/DescendantFonts', [])]:
            descriptor = item.get('/FontDescriptor')
            if not descriptor:
                continue
            descriptor = descriptor.get_object()
            if 'SUPER' in str(descriptor.get('/FontName', '')).upper() and descriptor.get('/FontFile2'):
                embedded = descriptor['/FontFile2'].get_object().get_data()
                break
        if embedded:
            break
    if embedded:
        break
if not embedded:
    raise RuntimeError('SUPER LITTLE was not found in the supplied manual')
font = TTFont(BytesIO(embedded))
required = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
cmap = font.getBestCmap()
assert all(ord(c) in cmap and font['glyf'][cmap[ord(c)]].numberOfContours != 0 for c in required)
# PDF subsets contain empty glyphs. Exclude them so browsers can use the fallback.
for table in font['cmap'].tables:
    if table.isUnicode():
        table.cmap = {code: glyph for code, glyph in table.cmap.items()
                      if code == 32 or font['glyf'][glyph].numberOfContours != 0}
prepare_titles(font, dest)

base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/'
def fetch(name):
    return urllib.request.urlopen(base + name, timeout=40).read()
font = TTFont(BytesIO(fetch('Montserrat%5Bwght%5D.ttf')))
cmap = font.getBestCmap()
required = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÁÉÍÓÚÜÑáéíóúüñ¡!¿?.,:;@+-/()'
assert all(ord(c) in cmap and font['glyf'][cmap[ord(c)]].numberOfContours != 0 for c in required)
for weight in [400, 600, 700]:
    static = instantiateVariableFont(font, {'wght': weight}, inplace=False)
    static.save(dest / f'montserrat-{weight}.ttf')
    static.flavor = 'woff2'
    static.save(dest / f'montserrat-{weight}.woff2')
(dest / 'montserrat-OFL.txt').write_bytes(fetch('OFL.txt'))
print('SUPER LITTLE extracted: A-Z and numbers verified. Montserrat: Spanish glyphs verified.')
