import pathlib

close_bad = "</" + "mo" + "tion>"
close_good = "</" + "di" + "v>"
open_bad = "<" + "mo" + "tion"
open_good = "<" + "di" + "v"

root = pathlib.Path(__file__).resolve().parent.parent
for path in list(root.glob("**/*.tsx")):
    if "node_modules" in str(path):
        continue
    text = path.read_text(encoding="utf-8")
    if close_bad not in text and open_bad not in text:
        continue
    path.write_text(
        text.replace(close_bad, close_good).replace(open_bad, open_good),
        encoding="utf-8",
    )
    print("fixed", path.relative_to(root))
