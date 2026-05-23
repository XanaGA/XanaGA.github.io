---
permalink: /
title: "Xavier Anadón García-Arquimbau"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

PhD researcher specializing in computer vision, 3D reconstruction, and geometric deep learning. I am part of the [Robotics, CV & AI Lab (RoPeRT)](https://ropert.i3a.es/) at Universidad de Zaragoza, under the supervision of [Prof. José María Martínez Montiel](https://scholar.google.com/citations?user=D99JRxwAAAAJ&hl=ca). My background includes a research stay at the [Computer Vision and Geometry Group](https://cvg.ethz.ch/) at ETH Zurich (2025) and internships across Europe. I received a BSc in Computational Mathematics (2023) with the highest GPA in the class, and an MSc in Robotics, Graphics, and Computer Vision (2024–2026, GPA: 9.62/10).

**Deep Learning · 3D Vision · Multimodal Learning**

[More about me](/about-me/) · [Download CV](/files/XavierAnadonCV.pdf)

Latest Experience
======
{% include base_path %}
{% assign sorted_experience = site.experience | sort: 'order' %}
{% for post in sorted_experience limit:3 %}
{% include archive-single-experience.html %}
{% endfor %}
{% if site.experience.size > 3 %}
<p><a href="{{ base_path }}/experience/">See all experience →</a></p>
{% endif %}

Latest Publications
======
{% for post in site.publications reversed limit:3 %}
{% include archive-single.html %}
{% endfor %}
{% if site.publications.size > 1 %}
<p><a href="{{ base_path }}/publications/">See all publications →</a></p>
{% endif %}

Latest Projects
======
{% for post in site.portfolio limit:3 %}
{% include archive-single.html %}
{% endfor %}
{% if site.portfolio.size > 3 %}
<p><a href="{{ base_path }}/projects/">See all projects →</a></p>
{% endif %}
