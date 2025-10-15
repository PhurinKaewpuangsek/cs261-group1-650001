SpringBoot :

	ตอนนี้ไฟล์ทุกอย่างอยู่ใน spring boot หมดแล้วนะทุกคน โดยจะมี folder ชื่อ frontend ที่เก็บทุกอย่างที่เป็น frontend ซึ่งหากอยากเปลี่ยนข้อมูลให้เปลี่ยนในสปริงดีกว่า
ข้อมูลทั้งหมดคือ



======================================================================================================================================================================================
										ที่อยู่ของข้อมูล frontend ทั้งหมด

	1.static ข้อมูลที่ไม่ค่อยเปลี่ยนอะไรมาก พวก css javascript

src/main/resources/static/
├── css                           <-------- ที่เก็บ css
│   ├── dashboard-style.css
│   ├── loginstyle.css
│   └── reviewstyle.css
├── index.html					   <-------- ที่เก็บ index หน้าหลัก
├── javascript					   <-------- ที่เก็บ javascript
│   ├── dashboard-script.js
│   ├── loginscript.js
│   └── reviewscrip.js
└── src                           <-------- ที่เก็บไฟล์รูปภาพ
    ├── Avatar
    │   ├── avatar1.jpg
    │   ├── avatar2.jpg
    │   ├── avatar3.jpg
    │   └── avatar4.jpg
    ├── dasboardSource
    │   ├── darkpanthip.png
    │   └── panthip.png
    └── source
        ├── cstu.jpg
        └── panthip.png




	2.Templates ใส่พวก Html ไรงี้

src/main/resources/templates/
├── dashboard
│   ├── dashboard.html
│   └── guestDashboard.html
└── review
    └── review.html


