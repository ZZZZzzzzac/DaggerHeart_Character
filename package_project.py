import os
import shutil
import zipfile
from datetime import datetime

# 项目根目录
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BUILD_DIR = os.path.join(PROJECT_ROOT, 'build')
DATA_CARD_IMAGES_DIR = os.path.join(PROJECT_ROOT, 'data', '全卡图')

EXCLUDE_DIRS = ['.git', 'memory-bank', 'build', '__pycache__']
EXCLUDE_FILES = ['package_project.py'] # 排除脚本自身

def get_all_files_in_directory(directory, exclude_dirs, exclude_files, include_card_images=True):
    """
    获取目录中所有文件的路径，排除指定的目录和文件。
    """
    file_paths = []
    for root, dirs, files in os.walk(directory):
        # 排除目录
        dirs[:] = [d for d in dirs if d not in exclude_dirs and os.path.join(root, d) not in [os.path.join(PROJECT_ROOT, ed) for ed in exclude_dirs]]

        # 如果不包含卡牌图片，则排除卡牌图片目录
        if not include_card_images and DATA_CARD_IMAGES_DIR == os.path.join(root):
            dirs[:] = [] # 清空子目录，不再深入
            files[:] = [] # 清空文件

        for file in files:
            file_path = os.path.join(root, file)
            if file not in exclude_files and not any(excluded_dir in file_path for excluded_dir in [os.path.join(PROJECT_ROOT, ed) for ed in exclude_dirs]):
                 # 再次检查，确保文件路径不包含任何排除的目录的绝对路径
                if not include_card_images and DATA_CARD_IMAGES_DIR in file_path:
                    continue
                file_paths.append(file_path)
    return file_paths

def create_project_archive(include_card_images=True):
    """
    创建项目归档文件。
    """
    if not os.path.exists(BUILD_DIR):
        os.makedirs(BUILD_DIR)

    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    archive_name_suffix = "带卡图" if include_card_images else "无卡图"
    archive_name = f"zzz车卡器_{archive_name_suffix}_{now}.zip"
    archive_path = os.path.join(BUILD_DIR, archive_name)

    print(f"Creating archive: {archive_path}")

    # 收集要打包的文件
    print("Collecting files...")
    files_to_archive = get_all_files_in_directory(PROJECT_ROOT, EXCLUDE_DIRS, EXCLUDE_FILES, include_card_images)

    if not files_to_archive:
        print("No files to archive.")
        return

    print(f"Found {len(files_to_archive)} files to archive.")

    with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in files_to_archive:
            arcname = os.path.relpath(file_path, PROJECT_ROOT) # 存储在zip中的相对路径
            print(f"Adding: {arcname}")
            zipf.write(file_path, arcname)

    print(f"Archive created successfully: {archive_path}")
    return archive_path

if __name__ == "__main__":
    # 创建包含卡牌图片的版本
    create_project_archive(include_card_images=True)
    # 创建不包含卡牌图片的版本
    create_project_archive(include_card_images=False)
    print("All archives created.")