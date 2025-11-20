---
layout: default
---

<img src="{{ 'assets/images/face.jpeg' }}" alt="My face" class="site-logo">

I am a math undergraduate at Carleton College applying to grad school for Fall
2026.

I am interested in Algebraic Geometry, Commutative Algebra, and Geometric
Topology. My CV is [here](assets/documents/Charlie_Ruppe_CV.pdf)

ruppec at carleton.edu

## Upcoming

- Joint Math Meetings, Washington DC. Presenting with Dennis Belotserkovskiy on
   our recent paper. Jan 4th.
   
## What I am working on...

My senior thesis in math illustration is looking to generate new intuition for
certain data and objects by visualizing them in non-euclidean spaces using
computer graphics.

Follow my progress on my [demos page!](demos)

## Research

-  "Asymptotic Invariants of Symbolic Powers of Binomial Edge Ideals" with
 Dennis Belotserkovskiy, Mariana Landín, and Lizzy Teryoshin.
 25 pages, 2025.
[Preprint.](https://arxiv.org/abs/2510.14272){:target="_blank"}

Research on binomial edge ideals with faculty from [University of
Nebraska-Lincoln](https://nebraskacommalg.github.io/RTG/conferences/reu.html){:target="_blank"} at Centro de Investigación en Matemáticas (CIMAT) in
Mexico.
Selected to present at Joint Mathematics Meetings.

Wrote and animated the following expository video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/GdGTsFzHxRs?si=EqYX6UsBKcG7Gjmk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

 - "Propogation of Solutions of Binary and Ternary Quadratic Forms" with Alex
   Lattal, and [Corey
   Brooke](https://sites.google.com/view/coreybrooke/home){:target="_blank"}. 2024,
   In preparation.
   
Research on organizing integer solutions of quadratic forms as trees
parameterized by matrix representations of free groups.  Delivered a 25-minute
presentation on our results to our summer research peers.
  
 - "Magnetic Configurations in Mesoscale Magnetic Dots" with Grace Gatewood,
   Petros Van den Heuvel, and [Barry Costanzi](https://www.carleton.edu/directory/bcostanzi/){:target="_blank"}.

Modeled energy landscapes of 250nm permalloy dots in
Golang/Python. Implemented system for managing simulations using
Github. Assembled and operated our sputtering system, for depositing metal
features used in experiments. Processed samples, wrote LabVIEW code for
measurement taking. Used a scanning electron microscope to image our samples
for computer simulations. Results given in a poster session: "Magnetic
Configurations in Mesoscale Magnetic Dots'' Student Research and Internship
Symposium. Carleton College, Northfield, MN, October 2023.

## Demos

<div class="demos-list">
  {% for demo in site.demos %}
  <div class="demo-card">
      <a href="{{ demo.url }}">
        {% if demo.image %}
        <img src="{{ site.baseurl }}/demos/{{ demo.image }}">
        {% endif %}
        <h3>{{ demo.title }}</h3>
      </a>
  </div>
  {% endfor %}
</div>
