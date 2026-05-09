#!/usr/bin/env python3
"""
AU Roadmap smoke test runner.

Runs a compact set of functional API checks against the local backend.
Designed for demo environments where login/register use CAPTCHA and
protected routes are easier to exercise with local dev JWTs.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT / "backend" / ".env"


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
      return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


ENV_FILE_VALUES = load_env_file(ENV_PATH)


def env(name: str, default: str | None = None) -> str | None:
    return os.getenv(name) or ENV_FILE_VALUES.get(name) or default


BASE_URL = env("AU_TEST_BASE_URL", "http://localhost:8080/api")
JWT_SECRET = os.getenv("AU_TEST_JWT_SECRET") or ENV_FILE_VALUES.get("JWT_SECRET")

STUDENT_ID = int(env("AU_TEST_STUDENT_ID", "1"))
ADMIN_ID = int(env("AU_TEST_ADMIN_ID", "3"))
STUDENT_EMAIL = env("AU_TEST_STUDENT_EMAIL", "jialaoliu@adelaide.edu.au")
ADMIN_EMAIL = env("AU_TEST_ADMIN_EMAIL", "admin@example.com")


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def generate_jwt(user_id: int, email: str, role: str, secret: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "id": user_id,
        "email": email,
        "role": role,
        "exp": int(time.time()) + 60 * 60 * 24 * 7,
    }
    header_b64 = b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_b64}.{payload_b64}.{b64url(signature)}"


def get_student_token() -> str | None:
    explicit = os.getenv("AU_TEST_STUDENT_TOKEN")
    if explicit:
        return explicit
    if JWT_SECRET:
        return generate_jwt(STUDENT_ID, STUDENT_EMAIL, "student", JWT_SECRET)
    return None


def get_admin_token() -> str | None:
    explicit = os.getenv("AU_TEST_ADMIN_TOKEN")
    if explicit:
        return explicit
    if JWT_SECRET:
        return generate_jwt(ADMIN_ID, ADMIN_EMAIL, "admin", JWT_SECRET)
    return None


def request_json(path: str, method: str = "GET", token: str | None = None, body: dict | None = None):
    url = f"{BASE_URL}{path}"
    headers = {"Accept": "application/json"}
    data = None

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(url, method=method, headers=headers, data=data)

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            parsed = json.loads(raw) if raw else None
            return resp.status, parsed
    except urllib.error.HTTPError as err:
        raw = err.read().decode("utf-8")
        parsed = json.loads(raw) if raw else None
        return err.code, parsed


def assert_true(condition: bool, message: str):
    if not condition:
        raise AssertionError(message)


def run_test(name: str, func):
    try:
        func()
        print(f"PASS  {name}")
        return True
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL  {name}: {exc}")
        return False


def test_health():
    status, data = request_json("/health")
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["status"] == "ok", "health payload missing ok status")


def test_list_programs():
    status, data = request_json("/programs?page=1&limit=3")
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "program list success flag should be true")
    assert_true(len(data["data"]) >= 1, "expected at least one program")


def test_program_roadmap():
    status, data = request_json("/programs/3/roadmap")
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "roadmap success flag should be true")
    assert_true("roadmap" in data["data"], "roadmap payload missing roadmap field")


def test_search_programs():
    query = urllib.parse.quote("computer")
    status, data = request_json(f"/search?q={query}&type=programs&limit=5")
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "search success flag should be true")
    assert_true("programs" in data["data"], "search payload missing programs key")


def test_unauthorized_me():
    status, data = request_json("/auth/me")
    assert_true(status == 401, f"expected 401, got {status}")
    assert_true(data["success"] is False, "unauthorized response should be unsuccessful")


def test_student_me():
    token = get_student_token()
    assert_true(token is not None, "student token is not available")
    status, data = request_json("/auth/me", token=token)
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "auth/me success flag should be true")
    assert_true(data["data"]["role"] in {"student", "alumni", "prospective", "admin"}, "unexpected role")


def test_student_connections():
    token = get_student_token()
    assert_true(token is not None, "student token is not available")
    status, data = request_json("/community/connections", token=token)
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "connections success flag should be true")


def test_discussion_validation():
    token = get_student_token()
    assert_true(token is not None, "student token is not available")
    status, data = request_json("/discussions/create", method="POST", token=token, body={"title": "", "content": ""})
    assert_true(status == 400, f"expected 400, got {status}")
    assert_true(data["success"] is False, "discussion validation should fail")


def test_admin_stats():
    token = get_admin_token()
    assert_true(token is not None, "admin token is not available")
    status, data = request_json("/admin/stats", token=token)
    assert_true(status == 200, f"expected 200, got {status}")
    assert_true(data["success"] is True, "admin stats success flag should be true")


TESTS = [
    ("GET /health", test_health),
    ("GET /programs", test_list_programs),
    ("GET /programs/3/roadmap", test_program_roadmap),
    ("GET /search", test_search_programs),
    ("GET /auth/me unauthorized", test_unauthorized_me),
    ("GET /auth/me as student", test_student_me),
    ("GET /community/connections as student", test_student_connections),
    ("POST /discussions/create validation", test_discussion_validation),
    ("GET /admin/stats as admin", test_admin_stats),
]


def main() -> int:
    print(f"Running smoke tests against: {BASE_URL}")
    passed = 0

    for name, test in TESTS:
        if run_test(name, test):
            passed += 1

    total = len(TESTS)
    print(f"\nSummary: {passed}/{total} tests passed")
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
