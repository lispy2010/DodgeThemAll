# this script will minify javascript files

# get all js files in the current directory
import os
import re

# get the current directory
current_dir = os.getcwd()

# get all files in the current directory
files = os.listdir(current_dir)

# get the js files
js_files = [file for file in files if file.endswith(".js")]

sizes = []

# get the size of each file
for file in js_files:
    # get the size of the file
    size = os.path.getsize(file)
    # add the size to the list
    sizes.append(size)

# and now minify them
for file in js_files:
    # open the file
    with open(file, "r", encoding="utf-8") as f:
        # read the file
        content = f.read()

        # remove comments
        content = re.sub(r"/\*[\s\S]*?\*/", "", content)
        content = re.sub(r"//.*", "", content)

        # remove whitespace
        content = re.sub(r"\s+", " ", content)

        # remove newlines
        content = re.sub(r"\n", "", content)

        # remove trailing whitespace
        content = re.sub(r"\s+$", "", content)

        # remove leading whitespace
        content = re.sub(r"^\s+", "", content)

        # write the file
        with open(file, "w", encoding="utf-8") as ff:
            ff.write(content)

sizes_min = []

# output sizes of all files
for file in js_files:
    # get the size of the file
    size = os.path.getsize(file)

    # output the size
    print(
        f"{file}: min: {size / 1024:.2f} KB, orig: {sizes[js_files.index(file)] / 1024:.2f} KB")

    # add the size to the list
    sizes_min.append(size)

# output the total size of all files
print(
    f"Total: min: {sum(sizes_min) / 1024:.2f} KB, orig: {sum(sizes) / 1024:.2f} KB")
