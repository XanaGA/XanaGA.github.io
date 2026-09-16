---
title: "Multimodal Floorplan Encoding: Learning Dense Modality-Invariant Representations"
collection: publications
category: conferences
permalink: /publication/2026-09-11-multimodal-floorplan-encoding
excerpt: "TwinWorld Workshop, ECCV 2026."
date: 2026-09-11
venue: "TwinWorld Workshop, ECCV 2026"
award: "Honorable Mention"
paperurl: "https://arxiv.org/abs/2609.12723"
bibtex: |
  @inproceedings{anadon2026multimodal,
    title     = {Multimodal Floorplan Encoding: Learning Dense Modality-Invariant Representations},
    author    = {Anad{\'o}n, Xavier and Pautrat, R{\'e}mi and Wang, Rui},
    booktitle = {ECCV 2026 TwinWorld Workshop},
    year      = {2026},
    eprint    = {2609.12723},
    archivePrefix = {arXiv},
    primaryClass  = {cs.CV},
    url       = {https://arxiv.org/abs/2609.12723}
  }
---

MMFE maps diverse 2D indoor representations — vector CAD drawings, raster renderings, sensor-derived density maps — into a shared dense latent grid, combining a frozen DINOv3 backbone with a trainable DPT head trained with a per-cell InfoNCE objective. Evaluated on Structured3D for cross-modal dense matching, similarity alignment and retrieval.
