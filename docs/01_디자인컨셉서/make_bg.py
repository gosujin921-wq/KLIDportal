# -*- coding: utf-8 -*-
"""표지 배경 이미지 생성: 145deg 다크 네이비 선형 + 우상단 블루/시안 라디얼 글로우."""
import numpy as np
from PIL import Image

W, H = 2560, 1440

def hx(s):
    return np.array([int(s[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float64)

# 좌표
ys, xs = np.mgrid[0:H, 0:W]
u = xs / (W - 1)
v = ys / (H - 1)

# 1) 선형 그라데이션 145deg (#070a13 -> #111b3d)
# 145deg: CSS는 위쪽 0deg에서 시계방향. 방향벡터 계산.
ang = np.deg2rad(145)
dx, dy = np.sin(ang), -np.cos(ang)
t = (u - 0.5) * dx + (v - 0.5) * dy
t = (t - t.min()) / (t.max() - t.min())
c0, c1 = hx('070A13'), hx('111B3D')
base = c0[None, None, :] * (1 - t[..., None]) + c1[None, None, :] * t[..., None]

# 2) 라디얼 글로우 at (78%,40%), 블루 rgba(51,92,255,.32), 68%에서 0
cx, cy = 0.78, 0.40
# 타원 비율 42% x 50% (가로/세로 반경, 화면 폭/높이 기준)
rx, ry = 0.42, 0.50
d = np.sqrt(((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2)
glow = np.clip(1 - d, 0, 1)
glow = glow ** 1.4  # 가장자리 부드럽게
blue = hx('335CFF')
a = 0.32
img = base * (1 - (glow * a)[..., None]) + blue[None, None, :] * (glow * a)[..., None]

# 3) 시안 보조 글로우 (작게, 우상단)
cx2, cy2 = 0.86, 0.22
rx2, ry2 = 0.22, 0.30
d2 = np.sqrt(((u - cx2) / rx2) ** 2 + ((v - cy2) / ry2) ** 2)
g2 = np.clip(1 - d2, 0, 1) ** 1.6
cyan = hx('6AE6FF')
a2 = 0.14
img = img * (1 - (g2 * a2)[..., None]) + cyan[None, None, :] * (g2 * a2)[..., None]

out = '/Users/gosujin/klid_2nd/docs/01_디자인컨셉서/표지_배경.png'
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out)
print('saved:', out)
