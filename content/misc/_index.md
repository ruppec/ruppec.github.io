---
title: "Misc"
description: "A miscellaneous collection of links"
---


[Daily Heathcliff](https://comiccaster.xyz/preview.html?url=https://comiccaster.xyz/rss/heathcliff)
: 

[Sourdough Recipe](https://tartinebakery.com/stories/country-bread)
: 

[Low-tech Magazine](https://solar.lowtechmagazine.com/)
: This magazine/website has some interesting ideas about sustainable design
that I have tried to adopt. My site is designed with acessibility and low-bandwidth in mind. Let me know
  if it can be improved in any way!
  
[Hundredrabbits](https://100r.co/site/home.html)
: The coolest blog I know. Lots of plan9 inspired software and tips for
  surviving on boat journeys around the Pacific.


[Color Scheme Picker](https://coolors.co/e5e5e5-b15656-094074-646f58-1b998b)
: 

My LaTeX setup
: I use [Emacs](https://www.gnu.org/software/emacs/) with
  [AUCTeX](https://www.gnu.org/software/auctex/). I use vim keybindings with
  [evil-mode](github.com/emacs-evil/evil). My latex specific setup is below.
  I appreciate any feedback or tips!
  ```elisp
  (use-package latex
    :defer t
    :ensure auctex
    :hook ((LaTeX-mode . turn-on-reftex)
            (LaTeX-mode . display-line-numbers-mode)
            ;;(LaTeX-mode . (lambda () (TeX-fold-buffer)))
            ;;idk why this doesn't work but I added it manually in the :config
            ;;section
            )
    :config
    (evil-define-key 'normal TeX-source-correlate-map (kbd "RET") 'TeX-view)
    (add-hook 'TeX-after-compilation-finished-functions
              #'TeX-revert-document-buffer)
    (add-to-list 'safe-local-variable-values ;allows tikzexternalize to work
                '(TeX-command-extra-options . "-shell-escape"))
    (setq reftex-plug-into-AUCTeX t)
    (setq TeX-source-correlate-start-server t ;Enables tex to pdf sync
            TeX-source-correlate-mode t
            TeX-parse-self t
            TeX-auto-save t))
  (use-package evil-tex
    :ensure t
    :hook (LaTeX-mode . evil-tex-mode))
    ```

This website
: My site is made with [Hugo](https://gohugo.io/) using a custom theme patterned
  off of [karthinks.com](https://karthinks.com/) and the [hugo cactus
  theme](https://github.com/monkeyWzr/hugo-theme-cactus).

Springer GTM Test
: If I were a Springer-Verlag Graduate Text in
Mathematics, I would be Frank Warner's <b><i>Foundations of Differentiable
Manifolds and Lie Groups</i></b>.<p> I give a clear, detailed, and careful
development of the basic facts on manifold theory and Lie Groups. I include
differentiable manifolds, tensors and differentiable forms. Lie groups and
homogenous spaces, integration on manifolds, and in addition provide a proof of
the de Rham theorem via sheaf cohomology theory, and develop the local theory of
elliptic operators culminating in a proof of the Hodge theorem.  Those
interested in any of the diverse areas of mathematics requiring the notion of a
differentiable manifold will find me extremely useful.  </p> <p>Which Springer
GTM would <i>you</i> be?  <a href="http://math.jhu.edu/~savitt/GTM.html">The
Springer GTM Test</a></p>


[KaTeX](https://katex.org/)
: This is a way of providing support for LaTeX equations on your website.
  It's faster than MathJax and is built for more server-side rendering which
  makes pages load faster for users.
  
  I also appreciate the
  [copy-tex](https://github.com/KaTeX/KaTeX/tree/main/contrib/copy-tex)
  extension. This makes you copy the underlying LaTeX code when you go to copy
  the equation. Try it out here:
  
  $$ \int_{-\infty}^\infty e^{-x^2} \, \mathrm{d}x = \sqrt \pi $$
  
  You can even copy pieces (like $x$) with the text before and after the
  equation.
