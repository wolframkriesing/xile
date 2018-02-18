# xile

Is actually "elix" reversed. Because this is my approach to elix, based on the experience
and the code written in the [elix project][elix]. I might copy+modify a lot of it, and I might
throw it all away in the end.

## What is different to elix?

I am trying to separate the logic and the UI from the beginning. In elix those two things go very much
hand in hand. Mixins like the [ArrowDirectionMixin] construct the UI, but they also have "business logic"
inside of them, like `canGoRight`.

### Tested "business logic"

I believe this can be separated, so I will try to purely separate what is the logic of such
a widget like the [carousel]. This deals with `items` which can be selected, etc.
I see a lot of value in the approach of elix providing ready-made pieces for things like
ARIA, RTL, Swipe, Touch, etc. and allowing to just mix them.
Though I experienced a lot of complication while trying to implement the [hc-carousel]
which was mostly about styling and adding a tiny bit of functionality.
Therefore I will try here to separate the UI and the logic.

Let's see if this works.

[elix]: https://github.com/elix/elix
[ArrowDirectionMixin]: https://github.com/elix/elix/blob/master/src/ArrowDirectionMixin.js
[carousel]: https://github.com/elix/elix/blob/master/src/SlidingCarousel.js
[hc-carousel]: https://github.com/holidaycheck/hc-carousel-component

# Install/setup, via nix

This project can be built and run locally using nix, to provide a reproducible environment (kinda like docker).
Using nix we provide the right node version, on top of which all other things are run.
1. Make sure to have nix installed (see [nixos.org/nix][nix]) and then
1. run `nix-shell shell.nix` (or simply `nix-shell`), a nix shell should open
1. run `npm i` (if you never did so, or you want to update)

[nix]: http://nixos.org/nix/
