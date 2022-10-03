# Blaze [DEPRECATED]

> This project is no longer actively maintained

## QuickLinks

- [🙋 Contribute to this project.](#Contribute)
- [🎯 View bounties.][4]
- [🐞 Report a bug][5]
- [❓ Ask a question.][6]

## Brief | A "Hacker News" for DAOs

Web3 and DAO culture is benefitting from a great influx of new projects
and ideas.  We recognize that we need a reliable and trustworthy source 
of high-quality curated content to filter out some of the noise so we 
can focus on building and innovating --- *by creators, for creators*.

---

## Contribute

*Cabin* operates under a bounty system for its products, including 
`Blaze`. Each bounty is specified as a task in the *Clarity* web app. 
You can view the full board of tasks with bounties [here][4]. On each 
task, you are welcome to comment questions to gain more context on what 
needs to be done. Once you understand a task well enough and are 
interested in completing it, contact a member in the [Discord server][2].

1. In *Clarity*, once assigned to the task, mark it as "*In Progress*".
2. Upon completion, commit changes locally to a new branch.
3. Push changes and create a pull request to the main repo.
4. Tag the relevant maintainers for review.
5. Once approved, merge your pull request and delete the branch.

**NOTE**: In the ethos of Web3, this project operates on transparent and 
permissionless contribution. Please make sure to read this `README` in 
its entirety to get acquainted in order to start contributing. If you've 
fully read the documentation and you run in to obstacles or have comments 
or questions, feel free to tag a member of the *Product Guild* or DM 
`delightfulabyss.eth#3679` in the Discord server.

## Setup

This project is mostly located in the `/packages` directory. Within 
that directory, there are two packages that are under active development:

  - `/app` - This hosts the source code for the user-facing web app.
  - `/contracts` - This hosts the smart contract source code, published
     as an NPM package.

1. Fork this repo to your Github account.
2. Clone the repo that you just forked to your local machine.
3. Install dependencies.  `yarn`
4. Run development app.  `yarn app:dev`

This should start a development web server and navigate your web browser 
to `localhost:3000`.

---

## Cabin

[Cabin][1] is a digitally-native organization (often
called a *DAO*) building a decentralized city by creators, for creators. 
You can learn more about us by [visiting our website][1] or 
[joining our Discord server][2]. Please consult our [brand guidelines][3] 
on how to work within our visual identity.

<!-- hyperlink references -->
[1]: https://www.creatorcabins.com "Cabin | Homepage"
[2]: https://discord.gg/4G6XjsCjM3 "Cabin | Discord Server"
[3]: https://github.com/CabinDAO/topo "Topo Repo| Brand Guidelines"
[4]: https://app.clarity.so/cabin/view/3039c279-2ee2-4da2-a604-dc1c23d5010c "Clarity | Bounties"
[5]: https://github.com/CabinDAO/Blaze/issues/new "Blaze repo | Report a Bug"
[6]: https://github.com/CabinDAO/Blaze/discussions "Blaze repo | Discussions"
