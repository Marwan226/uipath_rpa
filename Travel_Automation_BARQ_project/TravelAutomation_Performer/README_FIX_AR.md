# Performer Queue Fix

سبب مشكلة `No Queue Item was received by Performer` كان أن `Main.xaml` كان يدخل `Process.xaml` قبل ما يستدعي `Framework\GetTransactionData.xaml`.

التعديل الذي تم:

1. إضافة Invoke Workflow باسم `FIX: Get Transaction Data before Process` في أول State `Process Transaction`.
2. تمرير `TransactionItem` الناتج إلى `Framework\Process.xaml`.
3. تفريغ قيمة `OrchestratorQueueFolder` في `Data\Config.xlsx` حتى يستخدم الروبوت Current Folder.

## طريقة التشغيل

1. افتح UiPath Studio.
2. افتح هذا الملف:

`TravelAutomation_Performer_Fixed_Queue\project.json`

3. تأكد أنك مشغل Orchestrator/Assistant من فولدر:

`Travel Automation`

4. تأكد أن Queue اسمها:

`Travel Automation`

5. تأكد أن فيها Transactions بحالة:

`New`

6. شغل `Main.xaml`.

لو اشتغل صح، أول Queue Item هيتحول `In Progress` ثم حسب نتيجة Process إما `Successful` أو `Failed`.

## لو رجع الخطأ

افتح `Framework\GetTransactionData.xaml` وتأكد أن Activity `Get transaction item` فيها:

- QueueType = `Config("OrchestratorQueueName").ToString`
- FolderPath = فاضي أو Current Folder
- Reference = فاضي

