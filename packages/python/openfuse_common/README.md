# OpenFuse Common (Python)

This package houses shared domain models and API clients that are reused by services in the OpenFuse ecosystem. Publishing to PyPI makes it easy for enterprise extensions to depend on the same contracts without vendoring code.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[test]
pytest
```
