# https

biotrack uses `https` to support various browser-unsafe chromium only APIs, like
the [WebNFC](https://googlechrome.github.io/samples/web-nfc/) API and
the [WebUSB](https://googlechrome.github.io/samples/webusb/) API.
These APIs are only available in **secure** contexts, which means that the
connection must be encrypted with `https`.

However, since this is also a local website (not hosted on the internet), the
certificates biotrack generates are self-signed, and thus not verified by a
_certificate authority_.

Certificate authorities are usually present to 'verify' the legitimacy of a
certificate, and are used to prevent man-in-the-middle attacks. Thus,
browsers will report this page as unsafe, as it is essentially acting like how
a true malicious connection would act; by faking an HTTPS certificate, this
_could_ be some form of the aforementioned MitM attack.

However, this page is not harmful, and the connection is still encrypted from
bad actors. If you are using biotrack on a local network, you can safely ignore
the warning, unless you are worried about a compromised host network.

If you are worried about a compromised host network, you can manually
go to the host computer and verify the certificate fingerprint. The fingerprint
is displayed in the browser's developer console, and can be compared to the
fingerprint of the host computer.
