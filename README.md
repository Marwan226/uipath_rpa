# Travel Request to Purchase Requisition Automation

<p align="center">
  <img src="assets/travel-automation-architecture.png" alt="Travel Automation architecture from supplier email to purchase requisition" width="1100" />
</p>

<p align="center">
  An end-to-end workflow that turns supplier travel request emails into queue-based purchase requisition transactions.
</p>

## Overview

Travel request processing often involves repetitive work: downloading supplier attachments, checking request data, matching invoices, and creating purchase requisitions in a procurement portal.

This project automates that flow. It receives the supplier email and its attachments, validates the structured travel request data, creates a transaction for each valid request, and processes the transactions one by one through a web-based procurement portal.

The solution follows a **Dispatcher / Performer** architecture. This separates data preparation from transaction execution and makes the workflow easier to monitor, retry, and scale.

## Business Flow

```text
Supplier Email
  -> Download Attachments
  -> Classify TR Excel and Invoice PDFs
  -> Validate Travel Authorization and Business Rules
  -> Create Queue Transactions
  -> Process Each Transaction in the Procurement Portal
  -> Upload Invoice and Save the Purchase Requisition Output
```

## Solution Architecture

### Dispatcher

The Dispatcher prepares the work before any portal interaction happens.

- Reads supplier emails and downloads attachments
- Separates the travel request workbook from invoice PDF files
- Reads structured travel request data from Excel
- Generates transaction and attachment reference codes
- Validates duplicate Travel Authorization numbers and required fields
- Creates charge codes and transaction data
- Adds one queue item per valid transaction

### Performer

The Performer processes queued transactions one at a time.

- Retrieves the next available queue item
- Opens the local procurement portal
- Signs in and fills the purchase requisition fields
- Uses the charge code and the amount excluding VAT
- Uploads the matching invoice PDF
- Submits the requisition
- Saves the generated PR output and updates the transaction status

## Queue Transaction Data

Each transaction contains the business data required by the portal, including:

| Field | Purpose |
| --- | --- |
| `TransactionNumber` | Unique identifier for tracing the request |
| `LPONumber` | Travel Authorization / LPO reference |
| `InvoiceNumber` | Invoice reference used to match the PDF attachment |
| `PassengerName` | Traveler information |
| `CostCenter` | Financial allocation |
| `ChargeCode` | Charge code used in the requisition |
| `AmountExclVAT` | Amount submitted to the portal |
| `VAT` and `Total` | Invoice values retained for validation and audit |
| `TRFilePath` and `SheetName` | Source workbook location and worksheet |

> The portal amount uses **Amount Excluding VAT**, not the invoice grand total.

## Project Structure

```text
TravelAutomation/
├── TravelAutomation_Dispatcher/
│   ├── DispatcherMain.xaml
│   ├── Dispatcher/
│   │   ├── ReceiveEmail.xaml
│   │   ├── ClassifyFiles.xaml
│   │   ├── GenerateTransactionCodes.xaml
│   │   ├── ExtractTAAndValidate.xaml
│   │   ├── CreateChargeCode.xaml
│   │   └── AddToQueue.xaml
│   └── Data/
│       ├── Config.xlsx
│       └── Mapping Files/
├── TravelAutomation_Performer/
│   ├── Main.xaml
│   ├── Framework/
│   │   ├── GetTransactionData.xaml
│   │   ├── Process.xaml
│   │   └── SetTransactionStatus.xaml
│   ├── Data/
│   │   ├── Config.xlsx
│   │   └── Output/
│   └── PRCreating WebSite/
└── Documentation/
```

## Running the Demo

### 1. Prepare the environment

1. Create a queue named `Travel Automation` in the required orchestration folder.
2. Update the queue name and folder values in each project's `Data/Config.xlsx`.
3. Configure the email connection used by the Dispatcher.
4. Keep the training portal HTML file inside the Performer project.
5. Make sure the invoice PDFs are available in the input or documentation folder.

### 2. Run the Dispatcher

1. Open the Dispatcher project.
2. Run `DispatcherMain.xaml`.
3. Confirm that the queue contains new transactions.

### 3. Run the Performer

1. Open the Performer project.
2. Run `Main.xaml`.
3. The Performer retrieves a queue item, creates the PR in the portal, uploads the matched invoice, and updates the transaction result.

## Validation and Exception Handling

The workflow distinguishes between business and technical issues.

| Type | Example | Expected Behavior |
| --- | --- | --- |
| Business exception | Duplicate Travel Authorization or missing invoice | Marks the transaction as failed without creating a duplicate request |
| System exception | Browser, selector, portal, or queue connectivity issue | Records the error and allows retry according to queue configuration |

## Current Scope

- Structured Excel travel request processing
- Invoice PDF matching by invoice number
- Email attachment handling
- Queue-based transaction processing
- Procurement portal data entry and invoice upload
- Purchase requisition output saving

## Future Improvements

- Add document-understanding services for unstructured invoices
- Move passwords and sensitive configuration to secure assets
- Add automated reconciliation and completion emails
- Add reporting for processed, failed, and retried transactions
- Support multiple suppliers through dynamic vendor identification

## Security Notes

Do not publish real email addresses, passwords, connection identifiers, portal URLs, or production data. Store secrets in secure assets or environment variables before using this workflow outside a training environment.

## Demo

Add your Performer demonstration video here after uploading it to LinkedIn, YouTube, or a repository release.

---

Built as an RPA training project to demonstrate queue-based email-to-portal automation.
