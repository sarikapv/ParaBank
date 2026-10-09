# ParaBank -- SDET Automation Framework

A portfolio project demonstrating UI, API, and end-to-end testing using
**Playwright + TypeScript**, with GitHub Actions CI against the ParaBank
banking application.

> **Current status:** UI, API, and E2E automation are implemented. Smoke
> CI and scheduled/manual regression CI are configured. Database
> validation, AI-assisted testing, and application deployment CD are not
> implemented yet.

## Contents

-   [Project Overview](#project-overview)
-   [Technology Stack](#technology-stack)
-   [Coverage](#coverage)
-   [Framework Structure](#framework-structure)
-   [Local Setup](#local-setup)
-   [Test Execution](#test-execution)
-   [CI Workflows](#ci-workflows)
-   [Configuration and Secrets](#configuration-and-secrets)
-   [Reports and Debugging](#reports-and-debugging)
-   [Current Limitations](#current-limitations)

## Project Overview

The goal is to demonstrate a maintainable SDET automation solution
across UI, API, and critical end-to-end banking journeys. The framework
separates locators, page actions, common utilities, fixtures, test data,
and test specifications.

The repository also demonstrates a Git feature-branch and Pull Request
workflow, Smoke validation on pushes and Pull Requests, and
scheduled/manual regression execution with GitHub Actions.

## Technology Stack

  Area                    Technology
  ----------------------- -----------------------------------------
  Language                TypeScript
  UI and API automation   Playwright Test
  XML response parsing    `fast-xml-parser`
  Application in CI       ParaBank Docker container
  CI platform             GitHub Actions
  Source control          Git and GitHub
  Test data               JSON
  Reporting               Playwright HTML report and CI artifacts

## Coverage

Latest recorded successful full regression run: **32 tests passed**.

  -----------------------------------------------------------------------
  Layer                   Coverage                Recorded status
  ----------------------- ----------------------- -----------------------
  UI                      Registration, login,    16 tests passed locally
                          account opening,        
                          transfer, bill payment, 
                          and related flows       

  API                     Login/authentication,   20 API test cases
                          customer details,       implemented
                          accounts, account       
                          creation, transfers,    
                          bill pay, transactions, 
                          customer update         

  E2E                     Four critical user      4 E2E tests completed
                          journeys                

  Regression              Tagged regression suite Latest successful CI
                                                  run: 32 passed
  -----------------------------------------------------------------------

### E2E journeys

1.  Login → Open New Account.
2.  Login → Transfer Funds → Verify Transfer.
3.  Login → Bill Pay → Verify Payment.
4.  Login → Open New Account → Transfer Funds to the New Account →
    Verify Transaction.

## Framework Structure

``` text
ParaBank/
├── .github/
│   └── workflows/
│       ├── smoke.yml
│       └── regression.yml
├── commons/
│   ├── webCommons.ts
│   └── apiCommons.ts
├── config/
├── fixtures/
│   └── baseFixture.ts
├── pageObjects/
│   ├── pageElements/
│   └── pageSteps/
├── testData/
│   └── ui/
├── tests/
│   ├── api/
│   ├── e2e/
│   └── ui/
├── utilities/
├── .env                 # local only; do not commit
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

### Design principles

-   Keep UI locator definitions separate from test logic.
-   Encapsulate page/business actions in page-step classes.
-   Keep reusable browser and API interactions in common utilities.
-   Keep test scenarios and business assertions in test specifications.
-   Use fixtures and configuration for shared setup.
-   Keep reusable test inputs in JSON where appropriate.
-   Prefer composition over unnecessary inheritance.

## Local Setup

### Prerequisites

-   Node.js compatible with the project.
-   npm and Git.
-   Docker Desktop if ParaBank is not already running.
-   An editor such as Visual Studio Code (optional).

### 1. Clone the repository

``` bash
git clone https://github.com/sarikapv/ParaBank.git
cd ParaBank
```

### 2. Install dependencies

``` bash
npm ci
```

### 3. Install Playwright browsers

``` bash
npx playwright install
```

On Linux CI runners, the workflow uses
`npx playwright install --with-deps`.

### 4. Start ParaBank if needed

``` bash
docker run -d -p 8080:8080 --name parabank parasoft/parabank
```

Wait for startup, then open `http://localhost:8080/parabank/`. If a
`parabank` container already exists, inspect or start that container
instead of creating a duplicate.

### 5. Configure environment variables

Create a local `.env` file with the variable names expected by the
existing project configuration and tests. Set the base URL and test
credentials for your environment. Do not commit `.env`, passwords,
tokens, or other secrets.

## Test Execution

Direct Playwright commands for the current folder layout:

  ---------------------------------------------------------------------------------------
  Purpose                             Command
  ----------------------------------- ---------------------------------------------------
  UI tests                            `npx playwright test tests/ui`

  API tests                           `npx playwright test tests/api`

  E2E tests                           `npx playwright test tests/e2e`

  Smoke-tagged tests                  `npx playwright test --grep "@smoke"`

  Regression-tagged tests             `npx playwright test --grep "@regression"`

  List Smoke tests                    `npx playwright test --list --grep "@smoke"`

  List Regression tests               `npx playwright test --list --grep "@regression"`
  ---------------------------------------------------------------------------------------

PowerShell users should keep tag expressions in quotes.

To see all available npm scripts in the current checkout:

``` bash
npm run
```

The regression workflow invokes `npm run test:regression`; use the Smoke
script name defined in `package.json` for local Smoke execution.

## Test Tags

-   `@smoke` -- critical tests for faster validation.
-   `@regression` -- broader regression coverage.
-   `@ui` -- UI automation.
-   `@api` -- API automation.
-   `@e2e` -- end-to-end journeys.

A test can carry multiple tags, allowing a critical test to run in both
Smoke and Regression suites.

## CI Workflows

Workflow definitions are stored in `.github/workflows/`.

### Smoke CI --- `smoke.yml`

Configured for `push` and `pull_request` events. The workflow: 1. Checks
out source code. 2. Sets up Node.js and npm caching. 3. Installs
dependencies with `npm ci`. 4. Installs Playwright browsers and system
dependencies. 5. Starts ParaBank using Docker. 6. Waits for the ParaBank
readiness URL to respond. 7. Runs the Smoke suite. 8. Uploads the
configured report and test-results artifacts.

This provides fast feedback before a Pull Request is merged and
validates code pushed to the repository.

### Regression CI --- `regression.yml`

Supports scheduled weekday execution and manual execution using
`workflow_dispatch`. The configured cron expression is `0 18 * * 1-5`,
meaning **18:00 UTC / 23:30 India Standard Time, Monday to Friday**.

The workflow checks out code, sets up Node/npm, installs dependencies
and Playwright, starts ParaBank with Docker, waits for readiness, runs
the tagged regression suite, and uploads report/results artifacts.

### End-to-end workflow

``` text
Code change → Local validation → Feature branch → Commit and push
      ↓
Pull Request to main → GitHub Actions Smoke validation
      ↓
Checks pass → Merge to main → Post-merge Smoke validation
      ↓
Scheduled/manual Regression → Review reports and investigate failures
```

### Git workflow followed

1.  Create a feature branch.
2.  Implement and validate the change locally.
3.  Commit with a meaningful message.
4.  Push the branch to GitHub.
5.  Open a Pull Request to `main`.
6.  Resolve CI failures and re-run checks.
7.  Merge after required checks pass.
8.  Delete the merged feature branch when no longer needed.
9.  Synchronize the local repository with `main`.

## Configuration and Secrets

-   `playwright.config.ts` defines test discovery, projects, reporters,
    and execution settings.
-   CI credentials are stored in GitHub repository secrets.
-   The CI repository secrets currently used include `PARABANKUSERNAME`
    and `PARABANKPASSWORD`.
-   Keep secret names consistent with the workflow and test code.
-   Never commit `.env`, passwords, tokens, or other sensitive values.

## Reports and Debugging

Open the local Playwright HTML report after a run with:

``` bash
npx playwright show-report
```

The report is available only if the run generated it. In GitHub, open
the repository's **Actions** tab, select the workflow run, inspect the
failed step logs, and download the report/test-results artifact if
available.

When a test fails: 1. Identify the failing test and assertion. 2.
Determine whether the cause is test code, application behavior, test
data, or environment setup. 3. Review CI logs and available Playwright
traces/reports. 4. Reproduce locally where possible. 5. Fix the root
cause rather than masking it with arbitrary waits or weakened
assertions. 6. Re-run locally, push the fix, and confirm CI is green.

Retries help with transient failures, but tests that pass only after
retries should still be investigated for flakiness.

## Current Limitations

-   **Database validation:** Not implemented; the project does not
    currently claim direct SQL/database assertions.
-   **AI-assisted testing:** Not implemented; do not describe the
    framework as AI-powered until a real AI capability is integrated and
    demonstrated.
-   **Application deployment CD:** Not implemented. The current pipeline
    focuses on CI test validation, not deployment to staging or
    production.
-   The framework, test counts, commands, environment variables, and
    workflow triggers should be updated in this README whenever they
    change.

## Interview Summary

> I built a Playwright and TypeScript automation framework for ParaBank
> covering UI, API, and four critical end-to-end banking journeys. The
> framework uses reusable page elements, page steps, common utilities,
> fixtures, and test data. I implemented GitHub Actions CI: Smoke tests
> run on pushes and Pull Requests, while a separate workflow runs
> regression tests on a weekday schedule and can be triggered manually.
> The pipeline starts ParaBank with Docker, waits for application
> readiness, installs dependencies and browsers, uses GitHub repository
> secrets for credentials, and uploads test artifacts for investigation.
> Application deployment, database validation, and AI-assisted testing
> are not implemented yet.

Repository: https://github.com/sarikapv/ParaBank
