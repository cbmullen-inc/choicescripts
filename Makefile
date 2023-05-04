GAME_NAME ?= kingdom_manager

###
##@ Setup
###

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

###
##@ Choicescript Source
###

.PHONY: compile
compile: ## Compiles the latest version of your game
	@echo "-Compiling Game..."
	GAME_NAME=${GAME_NAME} \
	ACTION=compile \
	./scripts/choicescript.sh

.PHONY: compile-all
compile-all: ## Compiles all your games into index.html - useful for when you forget to do it locally
	./scripts/compile_all.sh

###
##@ Testing
###

.PHONY: randomtest
randomtest: ## Runs a randomtest over your scripts
	@echo "-Randomly testing Game..."
	GAME_NAME=${GAME_NAME} \
	ACTION=randomtest \
	./scripts/choicescript.sh

.PHONY: quicktest
quicktest: ## Runs a randomtest over your scripts
	@echo "-Quickly testing Game..."
	GAME_NAME=${GAME_NAME} \
	ACTION=quicktest \
	./scripts/choicescript.sh

.PHONY: test-all
test-all: ## Runs a quicktest over all the games
	./scripts/test_all.sh
