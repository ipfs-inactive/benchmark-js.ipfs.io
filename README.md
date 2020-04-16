## This repository has been archived!

*This IPFS-related repository has been archived, and all issues are therefore frozen*. If you want to ask a question or open/continue a discussion related to this repo, please visit the [official IPFS forums](https://discuss.ipfs.io).

We archive repos for one or more of the following reasons:

- Code or content is unmaintained, and therefore might be broken
- Content is outdated, and therefore may mislead readers
- Code or content evolved into something else and/or has lived on in a different place
- The repository or project is not active in general

Please note that in order to keep the primary IPFS GitHub org tidy, most archived repos are moved into the [ipfs-inactive](https://github.com/ipfs-inactive) org.

If you feel this repo should **not** be archived (or portions of it should be moved to a non-archived repo), please [reach out](https://ipfs.io/help) and let us know. Archiving can always be reversed if needed.

---
   
# [Benchmaks for js-ipfs](ipfs.io)

> Benchmarking interface for js-ipfs https://github.com/ipfs/js-ipfs

## Install

```sh
> git clone https://github.com/ipfs/benchmark.js.ipfs.io.git
```

## Custom Build Setup (optional)
To develop & build locally run :
Note: no need to run these commands if you are using the make commands below to deploy to IPFS)
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## Deploy to IPFS

To deploy the site Benchmark.js.ipfs.io, run :

```sh
# Install all the necessary dependencies and build out the optimized site where you can check it locally
> make

# Add the site to your local ipfs, you can check it via /ipfs/<hash>
> make deploy

# Save your dnsimple api token as auth.token
> cat "<api token here>" > auth.token

# Update the dns record for ipfs.io to point to the new ipfs hash.
> make publish-to-domain
```

The following commands are available:

### `make`

Build the optimised site to the `./dist` dir

### `make deploy`

Build the site in the `dist` dir and add to `ipfs` _(requires`ipfs` on your `PATH`)_

### `make publish-to-domain` :rocket:

Update the DNS record for `ipfs.io`.  _(requires an `auto.token` file to be saved in the project root.)_

If you'd like to update the dnslink TXT record for another domain, pass `DOMAIN=<your domain here>` like so:

```sh
> make publish-to-domain DOMAIN=tableflip.io
```

---

See the `Makefile` for the full list or run `make help` in the project root.

## Dependencies
- `Node.js` and `npm` for build tools
- `ipfs` to deploy changes
- `jq`, `curl` and an `auth.token` file in the project root containing your dnsimple api token to update the dns

All other dependencies are pulled from `npm` and the Makefile will run `npm install` for you because it's nice like that.

## Contribute

Please do! Check out [the issues](https://github.com/ipfs/benchmark.js.ipfs.io/issues), or open a PR!

Check out our [notes on contributing ](https://github.com/ipfs/js-ipfs#contribute) for more information on how we work, and about contributing in general. Please be aware that all interactions related to IPFS are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.
