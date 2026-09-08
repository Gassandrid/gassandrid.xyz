import importlib.util
import unittest
import sys
sys.dont_write_bytecode = True
from pathlib import Path

import marimo as mo

spec = importlib.util.spec_from_file_location('obsidian', Path(__file__).with_name('obsidian.py'))
obsidian = importlib.util.module_from_spec(spec)
spec.loader.exec_module(obsidian)

CONTEXT = {'currentSlug': 'thoughts/demo', 'files': [
    {'path': 'Thoughts/Demo.marimo.py', 'slug': 'thoughts/demo'},
    {'path': 'People/Simone Conradi.md', 'slug': 'people/simone-conradi', 'aliases': ['Conradi'], 'headings': {'Parent#A repeated heading': 'a-repeated-heading-1'}},
    {'path': 'Thoughts/Local.md', 'slug': 'thoughts/local'},
    {'path': 'Elsewhere/Local.md', 'slug': 'elsewhere/local'},
    {'path': 'One/Duplicate.md', 'slug': 'one/duplicate'},
    {'path': 'Two/Duplicate.md', 'slug': 'two/duplicate'},
    {'path': 'Attachments/Image One.png', 'slug': 'attachments/image-one.png'},
    {'path': 'Attachments/Paper.pdf', 'slug': 'attachments/paper.pdf'},
    {'path': 'Attachments/Sound.mp3', 'slug': 'attachments/sound.mp3'},
    {'path': 'Folder/Folder.md', 'slug': 'folder/index'},
]}

class ObsidianMarkdownTests(unittest.TestCase):
    def setUp(self):
        obsidian.install(CONTEXT)

    def render(self, text):
        return mo.md(text).text

    def test_paths_fragments_aliases_and_dynamic_strings(self):
        for target, href in [
            ('Simone Conradi#A Header|Display Name', '../people/simone-conradi#a-header'),
            ('People/Simone Conradi.md#^Block-ID', '../people/simone-conradi#block-id'),
            ('Conradi', '../people/simone-conradi'),
            ('Local', '../thoughts/local'),
            ('./Local.md', '../thoughts/local'),
            ('../People/Simone Conradi', '../people/simone-conradi'),
            ('#Local heading', '#local-heading'),
            ('#^Block-ID', '#block-id'),
            ('Folder/Folder', '../folder/'),
            ('Simone Conradi#Parent#A repeated heading', '../people/simone-conradi#a-repeated-heading-1'),
        ]:
            with self.subTest(target=target):
                self.assertIn(f'href="{href}"', self.render(f'[[{target}]]'))
        self.assertIn('>Display Name</a>', self.render('[[Simone Conradi#A Header|Display Name]]'))
        self.assertIn('>Simone Conradi#Header</a>', self.render('[[Simone Conradi#Header]]'))

    def test_unresolved_and_ambiguous_do_not_guess(self):
        for target in ['Missing', 'Duplicate']:
            output = self.render(f'[[{target}]]')
            self.assertIn('is-unresolved', output)
            self.assertNotIn('href=', output)

    def test_standard_links_and_media(self):
        output = self.render('[Person](People/Simone%20Conradi.md#Heading) [Here](#My%20heading)')
        self.assertIn('href="../people/simone-conradi#heading"', output)
        self.assertIn('href="#my-heading"', output)
        self.assertIn('href="https://example.com/a#B"', self.render('[Web](https://example.com/a#B)'))
        self.assertIn('href="obsidian://open?vault=Test"', self.render('[Vault](obsidian://open?vault=Test)'))
        output = self.render('![[Image One.png|100x200]] ![[Paper.pdf#page=3]] ![[Sound.mp3]] ![[Simone Conradi#Header]]')
        for expected in ['src="../attachments/image-one.png"', 'width="100"', 'height="200"', 'src="../attachments/paper.pdf#page=3"', '<audio', 'data-obsidian-embed="../people/simone-conradi#header"']:
            self.assertIn(expected, output)

    def test_code_escapes_comments_tables_and_formatting(self):
        output = self.render('==Highlight== %%hidden%%\n\n%%many\n\nlines%%\n\n`[[Conradi]] %%code%%`\n\n```md\n[[Conradi]] %%fence%%\n```\n\n\\[[Conradi]]')
        self.assertIn('<mark>Highlight</mark>', output)
        self.assertNotIn('hidden', output)
        self.assertNotIn('many', output)
        self.assertNotIn('<a ', output)
        self.assertIn('%%code%%', output)
        self.assertIn('%%fence%%', output)
        self.assertIn('<code>[[Conradi]] %%code%%</code>', self.render('<code>[[Conradi]] %%code%%</code>'))
        output = self.render('| Link |\n| --- |\n| [[Conradi\\|Display]] |')
        self.assertIn('>Display</a>', output)
        self.assertIn('<table>', output)

    def test_callouts_blocks_math_footnotes_and_mermaid(self):
        output = self.render('> [!tip]- **Title** [[Conradi]]\n> Body\n>\n> > [!note]+ Nested\n> > Text')
        self.assertIn('<summary class="callout-title"><strong>Title</strong>', output)
        self.assertIn('data-callout="note" open=""', output)
        self.assertIn('id="my-block"', self.render('Paragraph ^my-block'))
        self.assertNotIn('</span></p>', self.render('Paragraph ^my-block'))
        output = self.render('- First\n- Second\n\n^list-id')
        self.assertIn('<ul id="list-id">', output)
        self.assertIn('Inline text', self.render('A note ^[Inline text]'))
        self.assertIn('checked', self.render('- [?] Done'))
        output = self.render('## Héllo, World!\n\n$x^2$\n\nReference[^1]\n\n[^1]: Footnote')
        self.assertIn('id="héllo-world"', output)
        self.assertIn('<marimo-tex', output)
        self.assertIn('class="footnote"', output)
        self.assertIn('<marimo-mermaid', self.render('```mermaid\ngraph LR\n A --> B\n```'))

    def test_nested_markdown_and_widget_interpolation_remain_native(self):
        widget = mo.ui.slider(0, 10, value=3)
        value = 3
        output = self.render(f'{widget}\n\n{mo.md(f"==Value {value}== [[Conradi]]")}')
        self.assertIn('marimo-slider', output)
        self.assertIn('<mark>Value 3</mark>', output)
        self.assertIn('href="../people/simone-conradi"', output)
        self.assertEqual(mo.md('[[Conradi]]')._repr_markdown_(), '[[Conradi]]')

if __name__ == '__main__':
    unittest.main()
