
```bash
node scripts/local/test-pass-email.mjs you@example.com                    # all 3 passes, one email each
node scripts/local/test-pass-email.mjs you@example.com --design golden    # golden | donor | donor-couple
node scripts/local/test-pass-email.mjs you@example.com --name "Prince Raj" --member-id OCA-2015-0007 --batch 2015
node scripts/local/test-pass-email.mjs --no-send                          # just save the images

```
