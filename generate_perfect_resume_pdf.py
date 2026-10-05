import base64
import os
import subprocess

# 1. Read and base64 encode the portrait image
with open('assets/raksha_portrait.jpg', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Raksha Shetty - Resume</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 10mm 14mm 10mm 14mm;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  body {{
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1F2937;
    background: #FFFFFF;
    font-size: 10.5pt;
    line-height: 1.45;
  }}
  .resume-container {{
    max-width: 100%;
    margin: 0 auto;
  }}
  
  /* Header Section matching Image 1 */
  .header-wrap {{
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 2px solid #F3E8E8;
    padding-bottom: 14px;
    margin-bottom: 14px;
  }}
  .photo-frame {{
    width: 86px;
    height: 86px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #800000;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(128, 0, 0, 0.18);
  }}
  .photo-frame img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }}
  .header-info {{
    flex-grow: 1;
  }}
  .name {{
    font-size: 24pt;
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #111827;
    margin: 0 0 2px 0;
    line-height: 1.1;
  }}
  .title {{
    font-size: 12pt;
    color: #800000;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin: 0 0 7px 0;
  }}
  .contact-bar {{
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 9pt;
    color: #4B5563;
  }}
  .contact-item {{
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }}
  .contact-item a {{
    color: #800000;
    text-decoration: none;
    font-weight: 600;
  }}
  
  /* Section Header matching Image 1 */
  .section-title {{
    font-size: 11pt;
    font-weight: 800;
    color: #111827;
    border-bottom: 1.5px solid #F3E8E8;
    padding-bottom: 4px;
    margin: 12px 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .section-title-text {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }}
  .section-dot {{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #800000;
    display: inline-block;
  }}

  /* Content typography */
  p.about-text {{
    margin: 0;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #374151;
  }}

  .role-card {{
    margin-bottom: 10px;
  }}
  .role-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }}
  .role-title {{
    font-weight: 800;
    color: #111827;
    font-size: 10pt;
  }}
  .role-pill {{
    font-size: 8pt;
    font-weight: 700;
    background: #FDF2F4;
    color: #800000;
    border: 1px solid rgba(128, 0, 0, 0.18);
    padding: 2px 9px;
    border-radius: 9999px;
  }}
  .role-company {{
    color: #800000;
    font-size: 9pt;
    font-weight: 600;
    margin-bottom: 4px;
  }}
  ul.bullet-list {{
    margin: 0;
    padding-left: 18px;
    font-size: 9pt;
    color: #4B5563;
    line-height: 1.45;
  }}
  ul.bullet-list li {{
    margin-bottom: 2px;
  }}

  .edu-row {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }}
  .edu-degree {{
    font-weight: 800;
    font-size: 9.8pt;
    color: #111827;
  }}
  .edu-year {{
    font-size: 8.5pt;
    color: #6B7280;
    font-weight: 600;
  }}
  .edu-inst {{
    font-size: 9pt;
    color: #800000;
    font-weight: 600;
    margin-bottom: 8px;
  }}

  .skills-grid {{
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 8.8pt;
    color: #374151;
  }}
  .skill-row {{
    line-height: 1.4;
  }}
  .skill-name {{
    font-weight: 700;
    color: #111827;
  }}
  .skill-val {{
    color: #6B1D2F;
    font-weight: 500;
  }}

  .footer-meta-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #F3E8E8;
    font-size: 8.8pt;
  }}
  .footer-col-title {{
    font-weight: 800;
    color: #111827;
    margin-bottom: 3px;
  }}
  .footer-col-desc {{
    color: #4B5563;
    line-height: 1.4;
  }}
</style>
</head>
<body>

<div class="resume-container">
  <!-- Header matching Image 1 -->
  <div class="header-wrap">
    <div class="photo-frame">
      <img src="data:image/jpeg;base64,{img_b64}" alt="Raksha Shetty">
    </div>
    <div class="header-info">
      <h1 class="name">RAKSHA SHETTY</h1>
      <div class="title">Medical Counsellor</div>
      <div class="contact-bar">
        <span class="contact-item">📧 <a href="mailto:rakshashetty@gmail.com">rakshashetty@gmail.com</a></span>
        <span class="contact-item">📍 Rajajinagar, Bangalore-10</span>
        <span class="contact-item">🔗 <a href="https://www.linkedin.com/in/raksha-shetty-591157250/" target="_blank">LinkedIn Profile — Raksha Shetty</a></span>
      </div>
    </div>
  </div>

  <!-- About Me -->
  <div class="section-title">
    <span class="section-title-text"><span class="section-dot"></span> About Me</span>
  </div>
  <p class="about-text">
    BCA graduate with experience in healthcare client counseling, accounting, and office administration. Skilled in client communication, records management, billing, Excel reporting, and operational coordination. Knowledge of Power BI, Java, HTML, Figma, and business productivity tools. Known for careful documentation, confidentiality, and clear communication.
  </p>

  <!-- Experience -->
  <div class="section-title">
    <span class="section-title-text"><span class="section-dot"></span> Experience</span>
  </div>

  <div class="role-card">
    <div class="role-header">
      <span class="role-title">● Medical Counselor</span>
      <span class="role-pill">2026 – Present</span>
    </div>
    <div class="role-company">IVF Access, Rajajinagar, Bengaluru</div>
    <ul class="bullet-list">
      <li>Counsel clients and explain relevant services based on their needs and inquiries.</li>
      <li>Coordinate registrations, follow-ups, and client communication while maintaining accurate, confidential records.</li>
      <li>Work with internal teams to support client cases and day-to-day service delivery.</li>
    </ul>
  </div>

  <div class="role-card">
    <div class="role-header">
      <span class="role-title">● Accountant and Administration Executive</span>
      <span class="role-pill">2025 – 2026</span>
    </div>
    <div class="role-company">IVF Access, Rajajinagar, Bengaluru</div>
    <ul class="bullet-list">
      <li>Managed daily billing and accounting documentation, including invoices, receipts, expenses, and payment records.</li>
      <li>Maintained spreadsheets and business records; supported data entry and reporting using Excel and Microsoft Office.</li>
      <li>Coordinated administrative tasks and supported routine office operations.</li>
    </ul>
  </div>

  <!-- Education -->
  <div class="section-title">
    <span class="section-title-text"><span class="section-dot"></span> Education</span>
  </div>

  <div class="edu-row">
    <span class="edu-degree">Bachelor of Computer Applications (BCA) | CGPA: 8.65</span>
    <span class="edu-year">2022 – 2025</span>
  </div>
  <div class="edu-inst">KLE Society's S Nijalingappa College • Bangalore City University (2025)</div>

  <div class="edu-row">
    <span class="edu-degree">Pre-University (PUC)</span>
    <span class="edu-year">2020 – 2022</span>
  </div>
  <div class="edu-inst" style="margin-bottom: 4px;">R N Shetty PU College (April 2022)</div>

  <!-- Internships & Activities -->
  <div class="section-title">
    <span class="section-title-text"><span class="section-dot"></span> Internships &amp; Activities</span>
  </div>
  <ul class="bullet-list" style="margin-bottom: 6px;">
    <li><strong>Java Core and Web Development</strong> – Certified by Anudip Foundation</li>
    <li><strong>Business Analytics Internship</strong> – Certisured | 2025</li>
    <li><strong>Research head &amp; Student Council Member</strong> | 2023 – 2025 (KLE S Nijalingappa College)</li>
    <li><strong>3D Virtual Interior Design Project Based on Web</strong> — Built a responsive website using HTML, CSS, and JavaScript to simulate room layouts.</li>
    <li><strong>Completed hands-on training in VLOS Drone Operations</strong></li>
  </ul>

  <!-- Skills -->
  <div class="section-title">
    <span class="section-title-text"><span class="section-dot"></span> Skills</span>
  </div>
  <div class="skills-grid">
    <div class="skill-row"><span class="skill-name">● Data Analysis and Reporting:</span> <span class="skill-val">Advanced Microsoft Excel (data filtering, formulas, pivot tables, charting, analytical report preparation); Power BI dashboards and visualizations.</span></div>
    <div class="skill-row"><span class="skill-name">● Documentation and Presentations:</span> <span class="skill-val">Microsoft Word, PowerPoint, and Outlook.</span></div>
    <div class="skill-row"><span class="skill-name">● Business Systems:</span> <span class="skill-val">Tally ERP and CRM portal management.</span></div>
    <div class="skill-row"><span class="skill-name">● Programming and Web Development:</span> <span class="skill-val">Core Java, SQL, HTML, CSS, and JavaScript.</span></div>
    <div class="skill-row"><span class="skill-name">● IT Fundamentals:</span> <span class="skill-val">Computer networks and Digital communication.</span></div>
    <div class="skill-row"><span class="skill-name">● Design and Visualization:</span> <span class="skill-val">Figma, Canva, dashboard design, and interface layout.</span></div>
  </div>

  <!-- Footer meta: Languages & Interests -->
  <div class="footer-meta-grid">
    <div>
      <div class="footer-col-title">Languages:</div>
      <div class="footer-col-desc">• English (Fluent)<br>• Kannada (Native / Fluent)</div>
    </div>
    <div>
      <div class="footer-col-title">Additional Interests:</div>
      <div class="footer-col-desc">• Drone Piloting (VLOS)<br>• Travelling &amp; Music</div>
    </div>
  </div>
</div>

</body>
</html>
"""

with open('resume_template.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Generated resume_template.html successfully!")

# Now use Chrome headless to compile to assets/Raksha_Shetty_Resume.pdf
cmd = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--print-to-pdf=' + os.path.abspath('assets/Raksha_Shetty_Resume.pdf'),
    os.path.abspath('resume_template.html')
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome execution finished with exit code:", res.returncode)
print("File size of generated PDF:", os.path.getsize('assets/Raksha_Shetty_Resume.pdf'), "bytes")
