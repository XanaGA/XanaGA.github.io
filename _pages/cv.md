---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* **PhD in Computer Vision and Machine Learning**, Universidad de Zaragoza, Dec 2025 – Present. Topic: Geometry and learned representations for 3D scene understanding from video. Supervisor: José María Martínez Montiel.
* **MSc in Robotics, Graphics and Computer Vision**, Universidad de Zaragoza, Sep 2024 – Jan 2026 (GPA: 9.62/10). Thesis: Multimodal Floorplan Encoding (CVG ETH Zurich & Microsoft).
* **BSc in Computational Mathematics**, Universitat Jaume I, Sep 2019 – Jul 2023 (GPA: 9.26/10, highest in class). Thesis: Geometric foundations for geometry processing of neural implicit SDF representations.

Work experience
======
{% assign sorted_experience = site.experience | sort: 'order' %}
{% for post in sorted_experience %}
* **{{ post.title }}** ({{ post.period }}) — {{ post.organization }}
  * {{ post.excerpt | markdownify | strip_html }}
{% endfor %}

Internships
======
* **RobotX Summer Fellowship**, Computer Vision and Geometry Lab, ETH Zurich, Jul–Sep 2025 (3% acceptance ratio)
* **HPC Intern**, Karlsruhe Institute of Technology, Germany, Jul–Sep 2023
* **VR Intern**, University of Eastern Finland, Jul–Sep 2022
* **Robotics Apprenticeship**, Ingeniarius, Portugal, Jul–Sep 2021

Awards & Honors
======
* VII Premios Capitanía General de Valencia — Best academic record in Bachelor's (Engineering/Architecture), Valencian Community
* Extraordinary End-of-Degree Award — Best academic record, Computational Mathematics promotion 2019–2023
* Academic Excellence Ernest Breva — Best academic record in the academic year

Skills
======
* **Programming:** Python, C/C++, Matlab
* **Deep Learning:** PyTorch, Fastai, Hugging Face, TensorFlow; NeRF, Transformers, VAEs, GNNs, Diffusion Models, SLAM
* **CV & Robotics:** 3D Reconstruction, Scene Understanding, RGB-D Processing, ROS
* **Languages:** Spanish (Native), English (C1 Advanced)

Publications
======
<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

[Download full CV (PDF)](/files/XavierAnadonCV.pdf)
