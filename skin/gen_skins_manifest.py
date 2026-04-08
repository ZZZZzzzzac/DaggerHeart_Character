import os
import json

def generate_manifest():
    skin_dir = 'skin'
    if not os.path.exists(skin_dir):
        print(f"Error: Directory '{skin_dir}' not found.")
        return

    folders = []
    # 遍历 skin 目录下的所有文件和文件夹
    for item in os.listdir(skin_dir):
        item_path = os.path.join(skin_dir, item)
        # 确保是文件夹，并且不是隐藏文件夹
        if os.path.isdir(item_path) and not item.startswith('.'):
            folders.append(item)

    # 写入 folders.json
    manifest_path = os.path.join(skin_dir, 'folders.json')
    try:
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(folders, f, ensure_ascii=False, indent=2)
        print(f"Successfully generated {manifest_path} with {len(folders)} skin folders.")
    except Exception as e:
        print(f"Error writing to {manifest_path}: {e}")

if __name__ == "__main__":
    generate_manifest()
