---
title: OpenTelemetry in 2023 - What we learnt from the community and our users
slug: opentelemetry-roundup-2023
date: 2024-01-06
tags: [OpenTelemetry, Observability]
authors: [pranay,srikanth]
description: OpenTelemetry round for 2023 and what to expect in 2024
image: /img/blog/2024/01/otel-roundup.jpg
hide_table_of_contents: true
keywords:
  - opentelemetry
  - signoz
  - observability
  
---

<head>
  <link rel="canonical" href="https://signoz.io/blog/opentelemetry-roundup-2023/"/>
</head>

OpenTelemetry has brought a see change in the world of observability. The idea of the project was to standardise the instrumentation needed for generating telemetry. Teams shouldn’t need to change how they collect data if they want to try a new visualization/backend for the telemetry data. That was the vision.


<!--truncate-->

![Cover Image](/img/blog/2024/01/otel-roundup.webp)


This ideas seems to have resonated with the developer and devops communities. OpenTelemetry has become the [2nd most active](https://www.cncf.io/blog/2023/01/11/a-look-at-the-2022-velocity-of-cncf-linux-foundation-and-top-30-open-source-projects/) CNCF project after Kubernetes, and is seeing partipation from many big companies like AWS, Google, Microsoft, Splunk, etc.

If you think  about it, it makes sense. It helps companies be more future proof and prevent scenarios like [this](https://news.ycombinator.com/item?id=38861354), where users are left scrambling for alternatives when a proprietary product which is core part of their infrastructure is suddenly shut down.


<figure data-zoomable align='center'>
    <img className="box-shadowed-image" src="/img/blog/2024/01/opentelemetry-growth.png" alt="OpenTelemetry is the 2nd most active CNCF project after Kubernetes"/>
    <figcaption><i>OpenTelemetry is the 2nd most active CNCF project after Kubernetes</i></figcaption>
</figure>
<br/>


As a founder and maintainer of an OpenTelemetry native project (SigNoz) we are part of lots of users and customers trying to implement OpenTelemetry in the wild. I thought to sit down, and note what is the current state of OpenTelemetry as we exit 2023 and enter 2024. 

We also run [OTEL APAC End user group](https://opentelemetry.io/community/end-user/discussion-group/) meetup, so we hear lots of user stories on challenges they face as they try to adopt OpenTelemetry in their orgs.

### OpenTelemetry is getting more adoption & becoming more mature

- Enterprise scale companies like [EBay](https://innovation.ebayinc.com/tech/engineering/why-and-how-ebay-pivoted-to-opentelemetry/), [Canva](https://www.canva.dev/blog/engineering/tag/opentelemetry/) are moving to OpenTelemetry

- People are able to handle huge scale with OpenTelemetry. Even with our personal experience with SigNoz customers and users we have seen users easily send order of ~10-50TB/day logs and traces via OpenTelemetry SDKs and collectors and it scales seamlessly.

- Logs was announced to be GA in Kubecon NA 2023 (Nov 2023) which marks a big step for the project. Many organizations start their journey with observability with logs and this would help more companies adopt OTel at scale.

### Learnings from OpenTelemetry APAC End Users meetup group

As I mentioned, we also run OpenTelemetry APAC meetup group. Some of the key themes users have:

1. **How to setup OpenTelemetry at scale**

 The current OTel documentation have focus on sending logs/traces/metrics data from individual application to the a backend. But when someone is deploying OpenTelemetry in their organizations - they need understanding of what are best practices to deploy it. e.g. 

    - Should you send data directly to the o11y backend or via an OTel collector 

    - How many instances of otel-collectors should be run to handle their scale

    - Should telemetry data be sent directly to OTel collector or should there be a queueing mechanism like Kafka infront. Here's a [discussion](https://signoz.io/blog/maximizing-scalability-apache-kafka-and-opentelemetry/) on using Apache Kafka with OTel collector.

    - How should OTel collector be deployed in a k8s environments? What are the tradeoffs between having it as a daemonset/sidecar etc.

    <figure data-zoomable align='center'>
    <img className="box-shadowed-image" src="/img/blog/2024/01/sidecar-pattern.png" alt="Sidecar Pattern for collecting telemetry data in Kubernetes"/>
    <figcaption><i>Example Sidecar Pattern for collecting telemetry data in Kubernetes with SigNoz & OTel collectors</i></figcaption>
    </figure>
    <br/>

2. **Optimising the value generated and cost involved** 

Once the applications are instrumented the next question is how to optimise between the value generated and cost involved. Generally, people want to implement some sort of filtering mechanism of logs (e.g excluding healthcheck end points) or do sampling for traces. Esp. for [tail based sampling](https://opentelemetry.io/docs/concepts/sampling/#tail-sampling) for traces people have lots of questions around how to do it correctly.

3. **Evagelization within the org** 

Since Opentelemetry is still a new-ish project, people need more help in evangelising it in their org. Questions like what are the advantages compared to current solution, as introducing OpenTelemetry is an org wide change in how people are doing observability. It would need buyin from multiple stake holders with their own concerns and vantage points. 

As a community, we need to publish more success stories of organizations becoming successful with OTel and how they achieved it.

Other common themes of questions were not being able to understand that OTel is just focused on getting telemetry data and you still need a backend/visualization tool to get insight from this data. Here's a [video](https://www.youtube.com/watch?v=K5fs55i4T9c) trying to address the question of difference between OpenTelemetry and observability backends.


### Learnings from SigNoz users and customers

As we encounter many users and customers using SigNoz as the backend and visualization layer for OpenTelemetry data, we see lots of interesting use cases for OpenTelemetry. Some of the use cases powered by Otel which we find SigNoz users love a lot are:

1. **Leveraging OpenTelemetry semantic conventions**
    - At SigNoz, we deeply leverage OTel semantic conventions for showing views which would need be possible in non-otel native products. e.g. Something which many of our users and customers like a lot is the exceptions monitoring view created directly from traces data.
    - Linking traces and logs is more easily possible by inserting and using `traceid` fields in logs to show related logs to traces. This helps in correlating logs and traces easily and debugging issues faster.


<figure data-zoomable align='center'>
<img className="box-shadowed-image" src="/img/blog/2024/01/logs-data-model.png" alt="OpenTelemetry Logs Data Model"/>
<figcaption><i>OpenTelemetry Logs Data Model</i></figcaption>
</figure>
<br/>

2. **Users comfortable in doing manual instrumentation** 
Since OpenTelemetry semantic conventions are GA, users are very comfortable doing manual instrumentation for parts of code which don’t get automatically instrumented. Being an open standard, they have the guarantee that any other backend vendor they choose will also support these manual instrumentations by default.

3. **Switching to new o11y backends becomes very easy** 

We had an interesting incident where teams sending TBs of data per day are able to change observability backend in a matter of few minutes as their code was already instrumented with OTel and the new backend also supported OTel. This is only possible because of the open source standards which OTel has developed. Otherwise just changing the observability backend would have been a 3 month project taking a lot of bandwidth from the team.

4. **Willingness to invest time learning about OpenTelemetry** 

We see many teams being comfortable with spending the time to learn Otel fundamentals, as they know once their teams gets understanding of the basics they can use any vendors which support OTel and the basic constructs will remain same. This is very different from the earlier era where each tool would have their own proprietary conventions and changing backends would mean retraining the whole team

5. **Better Control and Optimization with OTel**

We have seen many customers use `filterprocessor` in OTel collector to optimise their metrics cost. This had been pretty seamless and gives better control to users on which metrics to parse. Also, OTel collector gives more controls on metrics and spans they want to send. For example you can choose which type of metrics you want to send for `hostmetrics` receiver. Most proprietary agents don’t give this flexibility to users.
    
Better control: We have seen customers use include and exclude instrumentation of Java classes using [annotation](https://opentelemetry.io/docs/instrumentation/java/automatic/annotations/) very easily.
    
6. **Using Tracing for performance testing**

We have seen some organizations use trace data to test performance of their system to periodically test the end to end flow of the data and analyse performance. People who deeply instrument and enable it. for performance analysis only for specific time when they want to do performance testing

7. **More and more projects emitting telemetry in OTLP format**

Open source products have support for emitting telemetry data in OTLP format so that it can be used to better understand their performance. Some examples of such projects are [ClickHouse](https://clickhouse.com/docs/en/operations/opentelemetry#tracing-the-clickhouse-itself), [Hasura](https://hasura.io/docs/latest/observability/opentelemetry/), [Traefik](https://doc.traefik.io/traefik/master/observability/tracing/opentelemetry/), etc.

8. **Using OTEL OpAMP framework for logs pipeline**

We are amongst the early adopters of the [OpAMP](https://opentelemetry.io/docs/specs/opamp/). It allows us to enable our customers to do operations with logs attributes from the UI. The logs pipelines UI provides the ability to create and manage the processors. SigNoz provides an easy-to-use UI to create and manage the processors which is loved by our users, and OpAMP was a big part of successfully implementing it.

<figure data-zoomable align='center'>
    <img className="box-shadowed-image" src="/img/blog/2024/01/opamp-signoz.png" alt="Logs Pipeline architure using OpAMP"/>
    <figcaption><i>Logs Pipeline architure using OpAMP in SigNoz</i></figcaption>
</figure>
<br/>

### What was achieved in OpenTelemetry in 2023?

- **Logs becoming GA** 

This was announced in Kubecon NA ( Nov 2023)

- **New tools coming up leveraging OpenTelemetry data format**

 Tools like <a href="https://github.com/kubeshop/tracetest">Tracetest</a> & <a href="https://github.com/traceloop/openllmetry"> OpenLLMetry </a> were released which leverage common data. We think the standardization of data formats will lead to an ecosystem of tools which go beyond observability into other areas like testing, performance, security, etc.

- **Stable release of the Metrics [API](https://github.com/open-telemetry/opentelemetry-go/blob/main/CHANGELOG.md#11600390-2023-05-18) and [SDK](https://github.com/open-telemetry/opentelemetry-go/blob/main/CHANGELOG.md#11900420007-2023-09-28) in the Go implementation**


- **OpAMP** 

[Open Agent Management Protocol](https://github.com/open-telemetry/opamp-spec) (OpAMP) is a network protocol for remote management of large fleets of data collection Agents. The spec is currently in Beta stage but lots of progress was made in 2023 to make it ready for production usage. As mentioned above, we at SigNoz also have leveraged it to make logs pipelines.

- **14 new receivers and 8 exporters were added in Otel Collector in 2023**

Some interesting ones are:

`datadog-receiver` : Famous receiver merged after it was sabotaged by [DataDog](https://github.com/open-telemetry/opentelemetry-collector-contrib/pull/5836#issuecomment-1404724926)

`gitproviderreceiver` : Allows receiving git events. This way users can measure dev productivity, aligning with DORA

`webhookeventreceiver` :Allows receiving events of any webhook style data source, user can also use transform extension to convert those events to logs

`apachesparkreceiver` : Allow monitoring of Apache Spark applications and jobs

`azuremonitorreceiver`: Allow to collect Azure Monitor metrics per a subscription/resource group(s) by using Azure REST API

`cloudflarereceiver` : Allows collecting cloudflare logs


### What we are excited about OpenTelemetry  in 2024

1. **Profiling as a new signal** 

A [new repo](https://github.com/open-telemetry/opentelemetry-proto-profile/pull/3) for profiling was created with details like the vision doc and some example code. The progress seems to be a bit slow with last PR merged ~4 months back, but it would be exciting to have profiling added as a signal in Otel so that it could be easily correlated with metrics, traces and logs.

2. **Query Standardization working group** 

There is a [WG under TAG observability](https://github.com/cncf/tag-observability/blob/main/working-groups/query-standardization.md) in CNCF which is working on query standardization. This is not specifically under OpenTelemetry project, as the scope of Otel is confined to generating telemetry data - but how this working group progesses would be interesting to see. If successful, this would help standardize the query language different observability backends use for creating dashboards and alerts, and potentially enable porting of queries across backends.

3. **CI/CD Observability working group** 

The [OpenTelemetry proposal](https://github.com/open-telemetry/oteps/pull/223/files?short_path=ed19fed#diff-ed19feda8141bff5ed96c91b5112b89956ff17f12b82f9954504f3906f2eb33d) focuses on enhancing CI/CD observability by establishing standard semantic conventions for telemetry data from CI/CD tools. This initiative aims to reduce the Lead Time for Changes, a critical DevOps metric. It suggests a four-stage observability process: Collect, Store, Visualize, and Alert, with OpenTelemetry providing a unified approach for data collection.

4. **OpenTelemetry Protocol with Apache Arrow**  

<figure data-zoomable align='center'>
    <img className="box-shadowed-image" src="/img/blog/2024/01/otel-arrow.png" alt="Traffic reduction with OTel Arrow"/>
    <figcaption><i>Traffic reduction with using OTel Arrow for transporting telemetry data </i></figcaption>
</figure>
<br/>

There has been [some efforts](https://opentelemetry.io/blog/2023/otel-arrow/) in Opentelemetry community to include Apache Arrow as the data format for OTLP. This integration facilitates a reduction in telemetry data traffic by a factor of 10 after compression, offering a 40% improvement over the best existing OpenTelemetry Protocol (OTLP) configurations with [Zstandard (zstd)](http://www.zstd.net/) compression enabled. As a result, this new protocol emerges as an optimal choice for transporting telemetry data over the internet. This project is currently in [Beta stage](https://github.com/open-telemetry/otel-arrow?tab=readme-ov-file) with some active development happening.

5. **OpenTelemetry Transform Language  (OTTL)** 

The OpenTelemetry Collector is a convenient place to transform data before sending it to a vendor or other systems. This is frequently done for data quality, governance, cost, and security reasons. 

Processors available in Otel Collector support dozens of different transformations on metric, span and log data. The [OTTL](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/README.md) is a language for transforming open telemetry data. This will help users in writing  processing operations in a SQL like declarative language in `transform` processor rather than specific syntaxes.

### Conclusion

OpenTelemetry has come a long way in 2023 and we are excited to see what 2024 brings. It would be very interesting to see more and more companies adopting OpenTelemetry and the ecosystem of tools around it growing.