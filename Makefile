SHELL=/bin/bash
DOMAIN="benchmark.js.ipfs.io"

IPFSLOCAL="http://localhost:8080/ipfs/"
IPFSGATEWAY="https://ipfs.io/ipfs/"
NPM=npm
NPMBIN=./node_modules/.bin
OUTPUTDIR=dist
PREPEND=@

build:
	@echo "Installing npm modules..."
	$(PREPEND)npm install && \
	echo "" && \
	echo "Installed npm modules"
	$(PREPEND)npm run build
	@echo "All files built to ./$(OUTPUTDIR)";
	@echo "";
	@echo "Next steps (make sure you have ipfs deamon running):";
	@echo "- make deploy";
	@echo "";

help:
	@echo 'Makefile for ipfs benchmarks'
	@echo '                                                                                                          '
	@echo 'Usage:                                                                                                    '
	@echo '   make                                Build the optimised site to ./$(OUTPUTDIR)                         '
	@echo '   make deploy                         Add the website to your local IPFS node                            '
	@echo '   make publish-to-domain              Update $(DOMAIN) DNS record to the ipfs hash from the last deploy  '
	@echo '                                                                                                          '

deploy:
	$(PREPEND)ipfs add -r -q $(OUTPUTDIR) | tail -n1 >versions/current ; \
	cat versions/current >>versions/history ; \
	export hash=`cat versions/current`; \
		echo ""; \
		echo "published website:"; \
		echo "- $(IPFSLOCAL)$$hash"; \
		echo "- $(IPFSGATEWAY)$$hash"; \
		echo ""; \
		echo "next steps:"; \
		echo "- ipfs pin add -r /ipfs/$$hash"; \
		echo "- make publish-to-domain"; \

publish-to-domain: versions/current
	DNSIMPLE_TOKEN="$(shell if [ -f auth.token ]; then cat auth.token; else cat $HOME/.protocol/dnsimple.ipfs.io.token; fi)" \
	./dnslink.sh $(DOMAIN) $(shell cat versions/current)

.PHONY: build help install deploy publish-to-domain clean
