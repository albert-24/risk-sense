import sys
import os
import subprocess
from datetime import date

# Add parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from version import __version__

def bump(version, part):
    major, minor, patch = map(int, version.split('.'))

    match part:
        case "patch":
            patch += 1
        case "minor":
            minor += 1
            patch = 0
        case "major":
            major += 1
            minor = patch = 0
        case _:
            raise ValueError("Use: patch | minor | major")

    return f"{major}.{minor}.{patch}"

def update_version_file(new_version):
    with open("version.py", "w") as f:
        f.write(f'__version__ = "{new_version}"\n')

def update_changelog(new_version, part, custom_message=""):
    messages = {
        "patch": "## Fixed minor bugs or issues.",
        "minor": "## Added new features while maintaining backward compatibility.",
        "major": "## Introduced breaking changes or major overhauls."
    }
    description = messages.get(part, "- Miscellaneous updates.")
    today = date.today().isoformat()

    changelog_entry = f"## [{new_version}] - {today}\n{description}\n"

    if custom_message:
        changelog_entry += f"{custom_message.strip()}\n"

    changelog_file = "CHANGELOG.md"
    if os.path.exists(changelog_file):
        with open(changelog_file, "r+", encoding="utf-8") as f:
            content = f.read()
            f.seek(0, 0)
            f.write(changelog_entry + "\n" + content)
    else:
        with open(changelog_file, "w", encoding="utf-8") as f:
            f.write("# Changelog\n\n" + changelog_entry + "\n")


def add_commit(new_version, part):
    commit_descriptions = {
        "patch": "Bug fixes or minor updates",
        "minor": "New features, backward-compatible",
        "major": "Breaking changes or major updates"
    }
    default_description = commit_descriptions.get(part, "")
    default_message = f"{part} version: {new_version}  {default_description}"

    print("\nEnter a custom commit message (optional). Press ENTER 3 times to finish.")
    print(f"Default: {default_message}")

    lines = []
    empty_count = 0

    while True:
        line = input()
        if line.strip() == "":
            empty_count += 1
            if empty_count >= 2:
                break
        else:
            empty_count = 0
            lines.append(line)

    custom_message = "\n".join(lines).strip()
    commit_message = f"\n\n{custom_message}" if custom_message else default_message

    return commit_message

def git_commit(commit_message):
    try:
        subprocess.run(["git", "add", "version.py", "CHANGELOG.md"], check=True)
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        print("✅ Committed version and changelog to Git.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git commit failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python bump_version.py [patch|minor|major]")
        sys.exit(1)

    bump_type = sys.argv[1]
    new_ver = bump(__version__, bump_type)

    update_version_file(new_ver)
    custom_message = add_commit(new_ver, bump_type)
    update_changelog(new_ver, bump_type, custom_message)
    git_commit(custom_message)

    print(f"Version bumped to {new_ver}")

