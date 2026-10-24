"""Repair the manual's incomplete Ó using its original O and acute outlines."""
from copy import deepcopy
from fontTools import subset
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent, GlyphCoordinates
from fontTools.ttLib.tables.ttProgram import Program

def prepare_titles(font, dest):
    glyf = font['glyf']
    source = glyf['Iacute']
    start = source.endPtsOfContours[-2] + 1
    accent = deepcopy(source)
    accent.numberOfContours = 1
    accent.coordinates = GlyphCoordinates(source.coordinates[start:])
    accent.flags = source.flags[start:]
    accent.endPtsOfContours = [len(accent.coordinates) - 1]
    accent.program = Program()
    accent.program.fromBytecode([])
    glyf['acute.repaired'] = accent
    accent.recalcBounds(glyf)
    base = glyf['O']
    repaired = Glyph()
    repaired.numberOfContours = -1
    repaired.components = []
    for name, x in [('O', 0), ('acute.repaired', round((base.xMin + base.xMax - accent.xMin - accent.xMax) / 2))]:
        component = GlyphComponent()
        component.glyphName = name
        component.x, component.y, component.flags = x, 0, 4
        repaired.components.append(component)
    glyf['Oacute'] = repaired
    font['hmtx']['acute.repaired'] = (0, 0)
    font['hmtx']['Oacute'] = font['hmtx']['O']
    font.setGlyphOrder(list(dict.fromkeys(font.getGlyphOrder() + ['acute.repaired'])))
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[ord('Ó')] = 'Oacute'
            table.cmap = {code: glyph for code, glyph in table.cmap.items()
                          if code == 32 or glyf[glyph].numberOfContours != 0}
    required = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789Ó. '
    assert all(ord(c) in font.getBestCmap() for c in required)
    subsetter = subset.Subsetter()
    subsetter.populate(text=required)
    subsetter.subset(font)
    font.flavor = None
    font.save(dest / 'super-little-titles.ttf')
    font.flavor = 'woff2'
    font.save(dest / 'super-little-titles.woff2')
