.PHONY: setup
setup: clean install ## Clean and install

.PHONY: clean
clean: ## Clean the filesystem
	rm -fr node_modules
	git clean -fdX

.PHONY: install
install: ## Get packages and set up gitHooks
	@echo "\nGetting NPM packages"
	npm install
	npm run prepare