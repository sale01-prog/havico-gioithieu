"""Old havicof.vn URLs (PHP shop, before 28/10/2026) -> one small HTML file per URL that sends visitors to the
matching section of the new page. GitHub Pages serves /gioi-thieu-cong-ty from gioi-thieu-cong-ty.html.
URL list: Search Console > Hiệu suất > Trang, 16 months to 26/10/2026. Shop-only pages (login, policies,
blog, uploads) stay 404 on purpose. Run once after changing OLD; the output files are committed."""
import os, re

O = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = """gioi-thieu-cong-ty tuyen-dung ghe-bar-cate24 phong-lam-viec-r3 ke-treo-tuong-cate19 giuong-tu-cate5
ban-lam-viec-cate8 he-thong-cua-hang ghe-an-nakashima----go-tu-nhien-r61xs46xc70-pd80 giuong-doi-cate26
ghe-an-carl-hansen--amp--son----ch33p-go-tu-nhien-dem-da-r48xc78xs53-pd70 ghe-banh-cate29 tu-ngan-keo-cate37
ghe-don-ghe-luoi-cate31 ban-an-cate22 sofa-2-3-cho-cate35 sofa-giuong-cate33 ghe-ngoai-troi-cate13
ghe-an-khong-tay-kinuta----n---dc02-r52-5xs54-5xc80-mau-go-beech-tu-nhien-pd100 ban-goc-cate15 san-pham
ban-an-1-2m-romana----d120xr80xc75-pd86 ghe-an-wishbone----go-tu-nhien-mau-xanh-ngoc-r55xs53xc77-pd68
ghe-thu-gian-wegner----ch25-go-tu-nhien-r71xs73xc73-pd82 tu-giay-cate36 bo-sofa-ngoai-troi-cate10
ghe-da-nang-co-tay-dem-da-wegner----pp503-go-tu-nhien-r54xs57xc75-pd73 giuong-don-cate27
giuong-doi-1-8m-lenia-queen----go-tu-nhien-r189-5xs209-7xc114-pd85 ghe-an-wegner----ch36-go-tu-nhien-r52xs49xc81-5-pd74
ban-an-1-4m-romana----d140xr80xc75-pd87 tu-quan-ao-cate38 ghe-thu-gian-cate32
ghe-an-co-tay-kinuta----n---dc01-r57xs54-5xc80--mau-den-pd97 ke-sach-cate18 ghe-an-wegner----ch20-go-tu-nhien-r54xs44xc75-pd83
ban-ghe-lam-viec-cate1 sofa--amp--ghe-cate6 tu-dau-giuong-cate28 giuong-doi-1-6m-lenia-queen-r169-5xs209-7xc114-pd91
ghe-an-eclipse----go-tu-nhien-dem-da-r52xs51-5xh78-pd72 phong-an-r7 ban-an-tron-kieu-thuy-dien-go-tu-nhien---120c75-pd78
ghe-an-cate23 ghe-an-kai-kristiansen----4110-go-tu-nhien-r59-5xs50xc72--mau-den-pd69 tu-cate7
ghe-an-khong-tay-tribute----t1002-r48xs54xc82--mau-go-beech-pd94 ban-an-wegner----ch327-go-tu-nhien-r180xs90xc75-pd76
ghe-bang-cate30 ghe-an-wegner----ch36-go-tu-nhien-r52xs49xc81-5--mau-den-pd99 ghe-an-alien-est-pro----go-tu-nhien-r45xs53xc96-pd93
giai-phap ghe-thu-gian-lento-go-tu-nhien-tua-lung-da--dem-da-r63-5xs66-04xc69-85-pd75
ghe-an-tribute----t1003-co-tay-go-tu-nhien-dem-da-r61-60xs59-69xc82-55--mau-den-pd71
ghe-an-wishbone----go-tu-nhien-r55xs53xc77--mau-go-oc-cho-pd98 ghe-thu-gian-kennedy-go-tu-nhien-r72-39xs91-44xc83-82-pd81
ghe-an-khong-tay-tribute----t1002-r48xs54xc82--mau-den-pd88 sanh--loi-vao-r6 ghe-an-sede----go-tu-nhien-r43xs51xc80--mau-go-beech-pd96
ghe-an-khong-tay-kinuta----n---dc02-r52-5xs54-5xc80-mau-den-pd90 hot-sale ghe-an-co-tay-kinuta----n---dc01-r57xs54-5xc80--mau-go-beech-pd89
ghe-an-kai-kristiansen----4110-go-tu-nhien-r59-5xs50xc72--mau-go-beech-pd95 ghe-an-sede----go-tu-nhien-r43xs51xc80--mau-go-oc-cho-pd79
ke-tv-cate17 phong-khach-r2 ke-tv-lenia-d150xr41xc51-pd92 ke-sach-krossa-go-tu-nhien-r80xs38xc178-pd67
tu-dau-giuong-lenia----go-tu-nhien-r51xs50-8xc61-pd84 bo-ban-ghe-an-cate21 bo-ban-ghe-ngoai-troi-cate11 sofa-goc-cate34
hot-deal phong-tam-r5 ban-an-anton----go-tu-nhien-r180xs90xc75-pd77 phong-ngu-r4 ban-trang-tri-cate16 ghe-lam-viec-cate9
ke-trang-tri-cate20 gia-ke-ban-cafe-cate3 ban-ngoai-troi-cate12 ban-ghe-an-cate4 ban-cong---san-vuon-r1 ban-cafe-cate14
ban-cong--amp--san-vuon-cate2""".split()
FIXED = {"gioi-thieu-cong-ty": "gioi-thieu", "tuyen-dung": "lien-he", "he-thong-cua-hang": "lien-he", "giai-phap": "nang-luc"}

def target(path):
    if path in FIXED:
        return FIXED[path]
    # shop pages: categories (-cate), rooms (-r), products (-pd), listings
    assert re.search(r"-(cate|r|pd)\d+$", path) or path in ("san-pham", "hot-sale", "hot-deal"), path
    return "san-pham"

assert len(set(OLD)) == len(OLD), "duplicate URL in OLD"
for path in OLD:
    to = "/#" + target(path)
    with open(os.path.join(O, path + ".html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(f"""<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>Công ty cổ phần gỗ HAVICO</title>
<link rel="canonical" href="https://havicof.vn/">
<meta http-equiv="refresh" content="0; url={to}">
<script>location.replace("{to}")</script>
</head><body><a href="{to}">Công ty cổ phần gỗ HAVICO</a></body></html>
""")
print(len(OLD), "redirect pages")
