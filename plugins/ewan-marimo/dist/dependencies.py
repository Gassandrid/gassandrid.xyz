"""Dependency bootstrap for the pinned islands runtime, which ignores PEP 723."""
import ast
import re
import tomllib

# Pure-Python UI packages absent from Pyodide's bundled package index. Keep this
# narrow: scientific packages already handled by loadPackagesFromImports stay
# under Pyodide's version constraints. A notebook can override this fallback.
BROWSER_PACKAGE_DEFAULTS = {"wigglystuff": "wigglystuff==0.5.21", "plotly": "plotly==5.24.1"}


def browser_dependencies(source):
    tree = ast.parse(source)
    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module and not node.level:
            imports.add(node.module.split(".")[0])
    metadata = re.search(r"(?m)^# /// script\s*\n((?:#(?:[^\n]*)\n)*)# ///\s*$", source)
    declared = []
    if metadata:
        text = "\n".join(line[2:] if line.startswith("# ") else line[1:] for line in metadata[1].splitlines())
        declared = tomllib.loads(text).get("dependencies", [])
        if not isinstance(declared, list) or not all(isinstance(item, str) for item in declared):
            raise ValueError("PEP 723 dependencies must be a list of requirement strings")
    declared_by_name = {requirement_name(item): item for item in declared}
    # Only bootstrap supported UI libraries. Existing notebook pins for
    # native/scientific packages cannot replace Pyodide's compiled packages.
    return [declared_by_name.get(module, requirement)
            for module, requirement in BROWSER_PACKAGE_DEFAULTS.items() if module in imports]



def requirement_name(requirement):
    match = re.match(r"[A-Za-z0-9][A-Za-z0-9._-]*", requirement)
    if match is None:
        raise ValueError(f"Expected a named PEP 508 requirement: {requirement!r}")
    return re.sub(r"[-_.]+", "-", match[0]).lower()


def bootstrap_code(requirements):
    if not requirements:
        return ""
    return (
        "import sys as _browser_sys\n"
        "if _browser_sys.platform == 'emscripten':\n"
        "    import micropip as _browser_pip\n"
        f"    await _browser_pip.install({requirements!r})\n"
    )
