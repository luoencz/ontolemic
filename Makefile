.PHONY: bundle

BUNDLE_NAME ?= ../ontolemic-frontend.tar.gz

bundle:
	cd frontend && tar -cvf $(BUNDLE_NAME) \
		.next \
		package.json \
		public \
		package-lock.json \
		next.config.ts \
		tailwind.config.ts \
		postcss.config.mjs \
		tsconfig.json \
		README.md
	cd ..