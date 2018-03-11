## Provisioning

### Setup

If you're on a new machine, you will need to configure the keys again by running

```
serverless config credentials --provider aws --key XXXXXXXX --secret XXXXXXX
```

### Passwords
The AWS Access Keys are stored in `provisioning/secrets.yml`. To decrypt the file you can run `ansible-vault view provisioning/secrets.yml`. The password for Ansible-vault is in 1password.

