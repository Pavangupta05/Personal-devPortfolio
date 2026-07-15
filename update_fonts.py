import sys

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'Poppins', sans-serif", "'Space Grotesk', sans-serif")
content = content.replace("font-family: 'Cinzel', serif;", "font-family: 'Space Grotesk', sans-serif;")
content = content.replace("font-family: 'Inter', sans-serif;", "font-family: 'Space Grotesk', sans-serif;")

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)
print('SUCCESS')
