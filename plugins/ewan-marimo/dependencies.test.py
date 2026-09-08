import ast
import sys
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
from dependencies import browser_dependencies, bootstrap_code


class BrowserDependencyTests(unittest.TestCase):
    def test_imported_ui_packages_are_installed(self):
        self.assertEqual(browser_dependencies('from wigglystuff import TangleLatex\nimport plotly.graph_objects as go'),
                         ['wigglystuff==0.5.21', 'plotly==5.24.1'])

    def test_import_examples_and_stdlib_do_not_trigger_installs(self):
        self.assertEqual(browser_dependencies('import math\ntext = "from wigglystuff import Tangle"\n# import plotly'), [])
        self.assertEqual(bootstrap_code([]), '')

    def test_notebook_widget_pin_overrides_default(self):
        source = '# /// script\n# dependencies = ["marimo==0.24.0", "numpy==2.3.5", "wigglystuff==0.5.32"]\n# ///\nfrom wigglystuff import TangleLatex\nimport numpy'
        self.assertEqual(browser_dependencies(source), ['wigglystuff==0.5.32'])

    def test_native_packages_keep_pyodide_versions(self):
        source = Path('content/Thoughts/Eigenfish.marimo.py').read_text()
        self.assertEqual(browser_dependencies(source), [])

    def test_bootstrap_is_awaited_browser_only_and_does_not_import_ui_early(self):
        code = bootstrap_code(['wigglystuff==0.5.21'])
        tree = ast.parse(code)
        self.assertIsInstance(tree.body[1], ast.If)
        self.assertTrue(any(isinstance(node, ast.Await) for node in ast.walk(tree.body[1])))
        self.assertNotIn('import wigglystuff', code)
        # Locally this must do nothing (micropip is not installed here).
        compile(code, '<bootstrap>', 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
        import asyncio
        asyncio.run(eval(compile(code, '<bootstrap>', 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT), {}))

    def test_lotka_source_gets_both_missing_packages(self):
        source = Path('content/Notes/Modeling Complex Systems/lotka_volterra.marimo.py').read_text()
        self.assertEqual(browser_dependencies(source), ['wigglystuff==0.5.21', 'plotly==5.24.1'])

if __name__ == '__main__':
    unittest.main()
