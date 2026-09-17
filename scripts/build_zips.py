import zipfile
import os

files_to_pack = [
    ('backend_php/api.php', 'api.php'),
    ('backend_php/db.php', 'db.php'),
    ('public/cosmetics_shop.sql', 'cosmetics_shop.sql'),
]

readme_content = """============================================================
MAELEKEZO YA KUWEKA MFUMO KWENYE XAMPP (OFFLINE & ONLINE)
============================================================

1. Washa XAMPP Control Panel:
   - Bonyeza 'Start' kwenye Apache
   - Bonyeza 'Start' kwenye MySQL

2. Weka Database (MySQL phpMyAdmin):
   - Fungua kivinjari: http://localhost/phpmyadmin/
   - Bofya 'New' upande wa kushoto, andika jina la database: cosmetics_shop
   - Bonyeza 'Create'
   - Ndani ya cosmetics_shop, bofya 'Import' juu
   - Chagua faili la 'cosmetics_shop.sql' kisha bofya 'Go' au 'Import'

3. Weka Faili za PHP:
   - Fungua: C:/xampp/htdocs/
   - Tengeneza folda inayoitwa 'cosmetics_shop' (au 'digitalshop')
   - Nakili faili hizi mbili ndani yake:
       - api.php
       - db.php
   - Njia kamili inapaswa kuwa:
       C:/xampp/htdocs/cosmetics_shop/api.php
       C:/xampp/htdocs/cosmetics_shop/db.php
       (au C:/xampp/htdocs/digitalshop/api.php)

4. Jaribu Muunganisho (Ping Test):
   - Fungua kiungo hiki: http://localhost/cosmetics_shop/api.php?action=ping
   - Iwapo folda yako ni digitalshop, fungua: http://localhost/digitalshop/api.php?action=ping
   - Ukiona ujumbe wa 'success: true', kila kitu kiko sawa!

5. Usawazishaji wa Offline:
   - Unapokuwa hauna mtandao, app inafanya kazi 100% bila kukwama.
   - Mtandao ukiwepo, bofya 'Sawazisha Sasa' au mfumo utatuma kiotomatiki mauzo yote kwenye database!
"""

for zip_name in ['public/cosmetics_shop_php_system.zip', 'public/digitalshop_php_system.zip']:
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as z:
        for src, arcname in files_to_pack:
            if os.path.exists(src):
                z.write(src, arcname)
        z.writestr('MAAGIZO_YA_KUSAKINISHA_XAMPP.txt', readme_content)
    print(f'Created {zip_name} successfully')
