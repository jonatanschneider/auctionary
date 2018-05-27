# How to contribute

This project is due to the 'Projektwoche' at THM in SoSe 18, from May 28th until June 1st. If you want to contribute, 
please contact one of our team members. 

> For contact information, see [AUTHORS.md](AUTHORS.md)

## Horizon

This project is meant to build a ebay-like clone. A seller will be able to sell products via an auction, which 
customers are able to place bids on.

For more information, see our [README.md](README.md).

## Getting Started

* Make sure you have a [THM Gitlab account](https://git.thm.de/).
* Submit an issue for every task if it does not already exist.
* Clearly describe the issue including steps to reproduce when it is a bug.

## Making changes

* Create a topic branch from where you want to base your work.
    * This should always be the master branch, unless something went terribly wrong.
    * Use tags to describe your issue/branch/merge request.
    * Always provide information on what you are working on.
    * To quickly create a topic branch, go to your issue, expand `Create a merge request` and select `Create branch`.
* Make commits of logical and atomic units.
* Check for unnecessary whitespaces with `git diff --check` before commiting.
* Create tests for your changes, if possible (yes, it takes time, it is annoying, but also it is **necassary**)
* Run *all* tests to assure nothing else was accidentally broken.

## Submitting Changes

* Push your changes to a topic branch in the repository.
* Check whether your topic branch is up to date with `master`. If not, please rebase your branch.
* Submit a merge request to the repository.
* Provide information about what changed.
* Mark you merge request with `ready for testing` when you finished your work. If you haven't already, mark it with `work in progress` and add `[WIP]: ` to the merge request's title.
* The team will then test your changes. When everything is as expected, your merge request will be marked as `ready for review`
* The scrum master will then check your code for style and compatibility. If everything is okay, your changes will be merged.
* If something goes wrong - do not panic! There will be a change request with more information about what went wrong. You can fix these problems, your merge request will remain open.


## Styleguides

### Git Commit Messages

* Use the present tense (`Add feature` instead of `Added feature`).
* Use the imperative mood (`Move cursor to...`instead of `Moves cursor to...`).
* Limit the first line to 72 characters or less.
* Reference issues and merge requests liberally after the first line.
