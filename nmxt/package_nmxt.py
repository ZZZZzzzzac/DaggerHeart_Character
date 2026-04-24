from datetime import datetime
from pathlib import Path
import zipfile

PROJECT_ROOT = Path(__file__).resolve().parent
NMXT_ROOT = PROJECT_ROOT / 'nmxt'
BUILD_DIR = PROJECT_ROOT / 'build'

EXCLUDE_NAMES = {
    'AGENTS.md',
    'workbook_dump.txt',
    '__pycache__',
}


def iter_nmxt_files():
    for path in NMXT_ROOT.rglob('*'):
        if path.is_dir():
            if path.name in EXCLUDE_NAMES:
                continue
            yield path
            continue

        if any(part in EXCLUDE_NAMES for part in path.parts):
            continue

        yield path


def create_nmxt_archive() -> Path:
    BUILD_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    archive_path = BUILD_DIR / f'nmxt_standalone_{timestamp}.zip'

    with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for path in iter_nmxt_files():
            if path.is_dir():
                continue
            arcname = path.relative_to(NMXT_ROOT)
            zipf.write(path, arcname)
            print(f'Adding: {arcname.as_posix()}')

    print(f'Created: {archive_path}')
    return archive_path


if __name__ == '__main__':
    create_nmxt_archive()
