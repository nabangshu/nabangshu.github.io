---
title: "Current gol again? Guwahati's power cuts, timed to the minute"
summary: "11 monitors, 6,900 days, 5,000 power cuts. Guwahati's outages love early mornings and hate January."
category: energy
region: Guwahati, Assam
tags: [power cuts, reliability, data]
charts: true
description: "11 voltage monitors, 6,900 days, 5,000 power cuts. Guwahati loses about 30 minutes of power a day, peaking at 7 am and in September."
image: /assets/img/posts/guwahati-outages-card.png
---

Ask anyone in Guwahati about power cuts and you will get an opinion. I wanted numbers.

From December 2016 to June 2019, the Prayas Energy Group's
[Electricity Supply Monitoring Initiative](https://doi.org/10.7910/DVN/CLLZZM) (ESMI) placed
voltage monitors in 11 homes and offices across Guwahati. Each monitor recorded the voltage at a particular 
wall socket every minute. When the reading drops to zero, the power is considered to be out. That gives a
minute-by-minute record of every power cut, which is close to 6,900 days of monitoring in total.

ESMI ran similar monitors at more than 500 sites across India, so we can also see how Guwahati
compares with other cities, towns and villages.

<div class="stats">
  <div class="stat"><b>30 min</b><span>without power on an average day</span></div>
  <div class="stat"><b>~5</b><span>outages a week at a typical site</span></div>
  <div class="stat"><b>17 min</b><span>length of a typical outage</span></div>
</div>

## Better than most of India, slightly behind other capitals

<figure class="chart" data-chart="/assets/data/guwahati-outages.json" data-key="groups"></figure>

The typical Guwahati site lost about **28 minutes of power a day**. That is far better than
most of the country. In district headquarters the typical figure was 46 minutes, in smaller
towns about an hour and a half, and in villages more than **six hours a day**.

But compared with other state capitals, Guwahati did slightly worse. The typical monitor in
another state capital lost about 20 minutes a day, and about two-thirds of those monitors saw
fewer outages than the typical Guwahati site.

## Two daily peaks: early morning and the middle of the day

<figure class="chart" data-chart="/assets/data/guwahati-outages.json" data-key="hourly"></figure>

Nights are the most reliable time in Guwahati, with about half a minute of outage per hour.
Things change quickly after 5 am. Outages peak between **6 and 8 am**, ease a little mid-morning,
and stay high from **11 am to 4 pm**, before settling down again in the evening.

Other state capitals show only the midday peak. The early-morning peak seems to be specific to
Guwahati. I can only try to guess the reasons. Days start early in the North-East: the sun rises
around 5 am, and water pumps, geysers and kitchens all switch on together. Planned maintenance
also tends to happen during working hours. If you work in power distribution in Assam and
know the answer, I would like to hear from you.

## The worst months are April to September

<figure class="chart" data-chart="/assets/data/guwahati-outages.json" data-key="monthly"></figure>

Seasons matter a lot. In January, Guwahati lost about **12 minutes a day**. By September it
was about **54 minutes**, more than four times as much. Outages rise from March, stay high
through the pre-monsoon storm season and the monsoon, and drop sharply in October.

That fits what most people in Assam would expect. Spring thunderstorms (the *bordoisila*) and
monsoon rain bring down trees and lines, and hot, humid months push up demand from fans and
coolers.

## Where you live matters

The 11 sites were not equal in power outage. Most of them lost 25 to 30 minutes a day. But Gohaibari lost about
**65 minutes a day** and Datalpara about 49, while the monitor at the Capital Electrical
Subdivision office (the electricity department's own office) lost just **5 minutes a day**.
The sites were monitored over different periods, and offices are often on different feeders
from homes, so this is not a strict comparison. But it shows that the city-wide average hides
a lot of nuance.

## Most outages are short

Of more than 5,000 outages, **44% lasted under 15 minutes** and two-thirds under half an hour.
Only 18% lasted an hour or more, and fewer than 3% lasted three hours or more.

This has a practical side. A small inverter or battery that can run a home for **one hour**
would have covered more than 80% of all outages in this data, provided that the users didn't try to run power hungry devices on inverter.

## A Grain of Salt
The results and conclusions need to be taken with a grain of salt. Mainly because:

- **Data ends in 2019.** This was over 7 years ago. Distribution in Assam has changed since then, so today's picture may be
  better or worse. This is what the data showed then, not a claim about today.
- **Eleven monitors are not the whole city.** They give a good picture of those locations,
  not of every neighbourhood.
- **A monitor sees everything at its socket,** including some rare fault inside the building.

In future posts I will look at whether these patterns can be **forecast**: if outages follow
the time of day and the season this closely, a household, a hospital or a small solar-plus-battery
system could plan around them. If you live in Guwahati, I would also like to know whether
this matches your experience today.

<details class="methods">
<summary>How I measured this</summary>

<p><strong>Data.</strong> Prayas Energy Group, Electricity Supply Monitoring Initiative, minute-level
voltage records, Harvard Dataverse, <a href="https://doi.org/10.7910/DVN/CLLZZM">doi:10.7910/DVN/CLLZZM</a>
(CC0 licence). Guwahati: 11 sites, 15 December 2016 to 30 June 2019.</p>

<p><strong>What counts as an outage.</strong> Each monitor reports the voltage every minute,
and a reading of 0 V means no supply (Prayas' definition). An outage is a run of 0 V minutes,
so a cut from 7:12 to 7:29 counts as 17 minutes. Cuts shorter than 5 minutes are ignored, and
if the power comes back for 5 minutes or less between two cuts, they count as one outage
(a flicker during restoration).</p>

<p><strong>Missing readings.</strong> Sometimes a monitor sends no reading at all, often because
it has itself run out of power during a cut. If such a blank stretch has 0 V readings on both
sides (power off before, still off after) and lasts no more than 6 hours, I count it as part
of the outage. Longer blanks are treated as unknown. This choice barely matters: without it,
Guwahati's average is 29.5 instead of 29.9 minutes a day. Runs of 0 V lasting more than 48 hours
are treated as a switched-off monitor and excluded.</p>

<p><strong>Comparisons.</strong> Sites with at least 180 days of data (438 sites). Group figures
are the median site. The time-of-day and monthly charts pool all observed days across sites.
Durations count only outages whose start and end were both observed.</p>
</details>
