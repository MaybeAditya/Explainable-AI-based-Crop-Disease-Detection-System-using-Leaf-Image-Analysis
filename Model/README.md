# Explainable and Responsible Vision Transformer-Based Plant Disease Classification

This repository contains the implementation of an explainable and responsible classification framework for plant disease detection using **Vision Transformers (ViTs)**. Developed at **Jaypee University of Information Technology**, this project addresses the limitations of traditional CNN-based systems by focusing on long-range spatial relationships and model transparency.

---

## 🌿 Project Overview

Traditional automated plant disease detection often relies on "black-box" CNN models that are difficult to interpret and struggle to capture global leaf information. Our framework utilizes a Vision Transformer architecture to ensure high accuracy while providing biological reasoning for its predictions.

### Key Features

* 
**Global Self-Attention:** Encodes long-range spatial relationships across leaf images to identify distributed symptoms like patchy rashes or vein discoloration.


* 
**Explainable AI (XAI):** Integrated with **Grad-CAM** and **LIME** to provide visual evidence of which regions (necrotic tissue, fungal spots, etc.) influenced the decision.


* 
**Responsible AI Evaluation:** Implements **Monte Carlo (MC) Dropout** for uncertainty estimation and **Expected Calibration Error (ECE)** to align model confidence with actual accuracy.


* 
**Robustness:** Demonstrated resilience against Gaussian noise, simulating real-world sensor imperfections and varied lighting.



---

## 🛠️ Methodology

### 1. Model Architecture

The system utilizes a Vision Transformer that:

* Divides input images into fixed $16 \times 16$ patches.


* Processes data through 12 stacked Transformer Encoders using a **CLS token** for final classification.


* Captures global dependencies rather than relying on local receptive fields.



### 2. Evaluation Pipeline

* 
**Tier 1 (Explainability):** Heatmaps and superpixel explanations to verify biological relevance.


* 
**Tier 2 (Reliability):** Calibration diagrams and Bayesian uncertainty estimation.


* 
**Tier 3 (Robustness):** Accuracy decay measurement under distributional perturbations.



---

## 📊 Experimental Results

The model was tested on the **PlantVillage dataset**, covering 14 crop species and 38 disease classes.

### Performance Comparison

| Model Variant | Accuracy (%) | Micro ROC-AUC |
| --- | --- | --- |
| CNN Baseline | 94.2% 

 | 0.972 

 |
| EdgePlantNet | 95.6% 

 | 0.981 

 |
| **ViT (Proposed)** | <br>**97.91%** 

 | <br>**0.99** 

 |

### Key Findings

* The model achieves a near-optimal **ROC-AUC of 0.99**.


* 
**ViT** decays more slowly under noise compared to CNNs, as attention is distributed rather than concentrated on single points.


* The **Expected Calibration Error (ECE)** is low, ensuring the model's confidence scores are reliable for agricultural decision-making.



---

## 📂 Dataset Composition

The dataset includes 53,800 images:

* 
**Crops:** Apple, Tomato, Corn, Potato, Grapes, Pepper, Peach, and more.


* 
**Pathologies:** Bacterial spots, blights, rust, molds, and viruses.



---

## 🎓 Citation

If you use this work, please cite:

> **Suryansh Sharma** 
