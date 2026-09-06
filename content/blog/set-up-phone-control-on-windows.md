---
title: How to set up Phone control on Windows
date: 2026-09-05
summary: Connect an Android phone to your Windows laptop, with automatic secure fallback when Wi-Fi blocks device-to-device connections.
author: WLSAPlus
---

Phone control lets you view and operate an Android phone from a Windows laptop. Connect USB for setup, then unplug it once the phone window opens. WLSAPlus tries direct Wi-Fi first. In the upcoming version, if that connection fails, it automatically offers its built-in Tailscale connection. There is no connection-mode setting to choose.

**Availability:** automatic fallback and the Android companion described below are being added for an upcoming release. They are not included in version 1.0.6. Install a release that includes this feature on both devices before following the secure-connection steps. Direct Wi-Fi instructions also apply to older releases.

You do not need to know Android development or networking. Follow each section in order and keep the phone unlocked during the first connection.

## What you need

- A Windows laptop with the WLSAPlus desktop app installed
- An Android phone
- A USB cable that supports data, not only charging
- The phone and laptop connected to the **same Wi-Fi network** for the fastest direct connection
- For automatic fallback: the updated WLSAPlus Android app, internet access on both devices, and the same personal Tailscale account on both

The **Windows app controls the phone**. The upcoming **Android companion receives the connection**; it does not control another phone. This feature is not available in the web or macOS version.

The secure connection is built into WLSAPlus. You do not need a separate Tailscale app or your own server. Tailscale provides the hosted sign-in, coordination, and relay service. A sign-in is required on each device the first time fallback is needed. Use your own account, not one shared by everyone at school.

Sound forwarding normally requires Android 11 or newer. Video, touch, and keyboard control may still work on older Android versions without sound.

## Step 1: Enable Developer options

Android hides Developer options by default. The exact names can be different on Samsung, Xiaomi, Huawei, Honor, Oppo, Vivo, Google Pixel, and other phones.

The usual method is:

1. Open the phone's **Settings** app.
2. Open **About phone**.
3. Find **Build number** or **Software information**.
4. Tap **Build number** seven times.
5. Enter the phone's PIN or password if asked.
6. The phone should show a message such as "You are now a developer."

If you cannot find Build number, search Bing or Baidu for:

```text
how to enable developer options [your phone brand and model]
```

For example: `how to enable developer options Xiaomi 15`.

## Step 2: Enable USB debugging

1. Return to the main **Settings** page.
2. Open **System**, **Additional settings**, or **Developer options**. The location depends on the phone brand.
3. Open **Developer options**.
4. Find **USB debugging** and turn it on.
5. Accept the warning shown by Android.

Some phones have another setting named **USB debugging (Security settings)** or **Install via USB**. WLSAPlus normally needs only the main USB debugging option. If touch or keyboard control does not work on a Xiaomi or similar phone, enabling the security-related USB debugging option may help.

## Step 3: Put both devices on the same Wi-Fi

Connect the phone and laptop to the same Wi-Fi network before opening Phone control.

Using the same internet provider is not enough. For example, a phone using mobile data and a laptop using school Wi-Fi are not on the same local network. The Wi-Fi name shown on both devices should normally be the same.

Guest Wi-Fi and some managed networks prevent devices from talking to each other, even when their Wi-Fi names match. The automatic fallback can connect through an encrypted internet relay when a direct connection is unavailable. Both devices can stay on that Wi-Fi, provided it permits access to Tailscale. A Wi-Fi password does not remove device isolation.

## Step 4: Make the first USB connection

1. Unlock the phone and leave its screen on.
2. Connect the phone to the laptop with the USB cable.
3. If the phone asks what the USB connection should be used for, choose **File transfer** or **Transferring files**. This is helpful when a phone does not expose data access automatically.
4. Watch the phone screen for an **Allow USB debugging?** message.
5. Select **Always allow from this computer** if this is your own laptop.
6. Select **Allow**.

Do not approve USB debugging on a public or unknown computer. This permission allows the computer to control parts of the phone.

## Step 5: Connect from WLSAPlus

1. Open WLSAPlus on the laptop.
2. Select **Tools**.
3. Open **Phone control**.
4. Leave **Turn off the phone display** enabled if you want the physical phone screen to become black while the computer view stays active.
5. Select **Connect by USB**.
6. Keep the phone unlocked and connected by USB while WLSAPlus reads the phone information and enables wireless mode.
7. If the USB debugging message appears again, select **Allow**.
8. If prompted to sign in or approve a computer, follow the secure-connection steps below.
9. Wait for the phone window to open on the laptop.

After the phone window opens and WLSAPlus says the phone is connected, you can unplug the USB cable. The phone window should continue working over Wi-Fi.

Android 11 phones should remain unlocked while the phone window is starting so that audio capture can begin correctly.

## If WLSAPlus asks for a secure connection

This only appears when the direct Wi-Fi connection fails. Keep the USB cable connected throughout these steps.

1. On Windows, select **Sign in** when it appears in Phone control. A browser opens the official Tailscale sign-in page. Create or sign in to your personal account and finish adding the computer.
2. WLSAPlus opens **Connect to computer** in the Android app. You can also open it yourself from the Android app's login screen or **Tools**; a PowerSchool login is not required.
3. On the phone, select **Enable connection**. Allow notifications so that the persistent **Stop** control stays visible.
4. Select **Sign in to Tailscale** on the phone. Use the **same account** as on the laptop. Return to WLSAPlus after finishing in the browser.
5. When the phone says **Ready to pair**, select **Pair computer**.
6. Compare the six-digit code on the phone with the code shown in WLSAPlus on the laptop. If they match, select **Approve matching code** and confirm. Never approve a code you did not request or one that does not match.
7. Wait until the actual phone window opens on Windows. Only then unplug USB.

The pairing window expires after three minutes. If setup times out while you are creating an account, finish signing in and select **Connect by USB** again on Windows. If one side already saved the pair but the other did not, use **Forget** on Windows and **Forget computer** on Android, then repeat USB approval.

Only one computer is approved at a time. The sign-in and approved pair are saved securely on each device. WLSAPlus does not need your Tailscale password. The connection carries phone-control traffic only; it is not a full-device VPN.

Some accounts require device approval in the Tailscale admin console. Custom account access rules must permit the two devices to communicate. Hosted service availability, account limits, relay distance, and network restrictions still apply; fallback cannot guarantee a connection on every network.

## Using the phone from the laptop

- Click or drag with the mouse to touch and swipe.
- Type with the laptop keyboard when a text field is selected.
- Copy and paste text between the laptop and phone.
- Use the controls in WLSAPlus for **Back**, **Home**, **Recent apps**, volume, and power.
- Select **Close phone** when you want to close the mirrored phone window.

If **Turn off the phone display** was enabled, the real phone screen stays black to reduce distraction and power use. The mirrored view on the laptop remains visible. The phone is still running, not switched off.

## Reconnecting later without USB

As long as the phone has not restarted and remains reachable:

1. Open **Tools > Phone control**.
2. Select **Open wirelessly**.
3. For a paired connection, open **Connect to computer** on Android and select **Enable connection** if it is stopped.
4. Keep the phone awake and wait for the phone window to open.

Android may disable the debugging connection after the phone restarts or Developer options are reset. Reconnect the cable and select **Connect by USB** again; you normally do not need to forget the saved pair. If the connection fails to reopen, the USB button also appears beside the retry control.

## Troubleshooting

### WLSAPlus keeps waiting for USB

- Confirm that USB debugging is enabled.
- Unlock the phone and look for the authorization message.
- Try another USB port.
- Try another cable. Many inexpensive cables can charge but cannot transfer data.
- Disconnect other Android phones from the laptop. WLSAPlus expects one USB phone during setup.

### The phone says USB debugging is unauthorized

Unlock the phone, select **Allow** on the debugging message, and try again. If no message appears, open Developer options, select **Revoke USB debugging authorizations**, reconnect the cable, and approve the new message.

### WLSAPlus cannot find a Wi-Fi address

Make sure Wi-Fi is turned on for the phone. With the upcoming version, a missing direct Wi-Fi address starts the secure fallback instead. The fallback still needs internet access and the Android companion.

### The wireless connection fails

The Wi-Fi network may block communication between devices. Leave USB connected and let WLSAPlus try its secure connection automatically. If that also fails, confirm that both devices are signed in to the same Tailscale account and that the Android connection is enabled. After a phone restart, repeat USB setup.

If Tailscale itself is blocked or unreachable, neither this fallback nor a matching Wi-Fi name can fix that. Use an allowed network or USB-based mirroring software. WLSAPlus does not change the Wi-Fi administrator's settings.

### The connection stops when the phone screen is off

Keep the WLSAPlus phone-connection notification active. In Android app battery settings, allow WLSAPlus to run in the background if your phone manufacturer stops it. This may use more battery. Reopen **Connect to computer** and enable it again after force-stopping the app.

### The phone connects but there is no sound

Audio requires Android 11 or newer and may be blocked by individual apps. Unlock the phone before opening the phone window. Video and control can continue even when audio is unavailable.

### Touch or keyboard input does not work

Confirm that the phone still shows the connected computer as authorized in Developer options. Some phone brands also require their additional USB debugging security option.

## Turning the feature off

Select **Close phone** to close the mirrored window. This does not revoke the computer's approval.

For a paired connection, select **Stop connection** in the Android app or **Stop** in its notification to close the secure connection. Select **Forget computer** on Android to revoke the approved computer immediately. Also select **Forget** on Windows to remove its saved pairing. Pair again by USB when changing computers or phones.

Turn off USB debugging from Android Developer options when you no longer need Phone control. USB setup enables Android's ADB network listener, so stopping the secure connection alone does not disable Android debugging. Never forward its debugging port through a router or approve unknown computers.
