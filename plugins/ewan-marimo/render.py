import asyncio
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True

from dependencies import browser_dependencies, bootstrap_code

try:
    import marimo
    from marimo import MarimoIslandGenerator
except ImportError as error:
    print(json.dumps({"error": f"marimo not installed: {error}"}))
    raise SystemExit(0)


def main() -> None:
    payload = json.load(sys.stdin)
    requirements = browser_dependencies(Path(sys.argv[1]).read_text())
    source = MarimoIslandGenerator.from_file(sys.argv[1], display_code=False)
    generator = MarimoIslandGenerator()
    generator._config = source._config
    generator._source_filename = source._source_filename
    # Install once, then express an explicit graph dependency from every cell.
    # Original Python strings/f-strings stay untouched; both preview execution
    # and Pyodide use the same compiled cells and the native mo.md/Html API.
    extension = Path(__file__).with_name("obsidian.py").read_text()
    context = json.dumps(payload.get("markdownContext", {}))
    generator.add_code(
        bootstrap_code(requirements)
        + f"import json as _obsidian_json\n"
        f"_obsidian_namespace = {{}}\n"
        f"exec({extension!r}, _obsidian_namespace)\n"
        f"_obsidian_namespace['install'](_obsidian_json.loads({context!r}))\n"
        "ewan_obsidian_ready = True",
        display_code=False, display_output=False,
    )
    for stub in source._stubs:
        generator.add_code("ewan_obsidian_ready\n" + stub.code, display_code=False)

    if payload.get("staticPreview"):
        asyncio.run(generator.build())

    body = generator.render_body(max_width="none", margin="0")
    print(
        json.dumps(
            {
                "body": body,
                "marimoVersion": marimo.__version__,
                "browserDependencies": requirements,
                "islandCount": body.count("<marimo-island"),
                "reactiveIslandCount": body.count('data-reactive="true"'),
            }
        )
    )


try:
    main()
except Exception as error:
    print(json.dumps({"error": f"render failed: {error}"}))
