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

[Hugo](https://gohugo.io/)
: How I wrote this website

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
  (add-hook 'TeX-after-compilation-finished-functions #'TeX-revert-document-buffer)
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
