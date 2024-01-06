---
title: What happened in Opentelemetry in 2023 & what should you expect in 2024
slug: opentelemetry-roundup-2023
date: 2024-01-05
tags: [OpenTelemetry, LLM]
authors: pranay
description: Unlock the secrets of LLM observability - Follow this guide to seamlessly integrate OpenTelemetry with your LLM application and elevate observability with SigNoz....
image: /img/blog/2024/01/llm-observability-cover.jpeg
hide_table_of_contents: true
keywords:
  - opentelemetry
  - signoz
  - observability
  - llm
---

<head>
  <link rel="canonical" href="https://signoz.io/blog/opentelemetry-roundup-2023/"/>
</head>

OpenTelemetry has brought a see change in the world of observability. The idea of the project was to standardise the instrumentation needed for generating telemetry. Teams shouldn’t need to change how they collect data if they want to try a new visualization/backend for the telemetry data. That was the vision.


<!--truncate-->

![Cover Image](/img/blog/2024/01/llm-observability-cover.webp)


This ideas seems to have resonated with the developer and devops communities. 

<!--Link on opentelemetry being the 2nd most active CNCF project after kubernetes-->

If you think  about it, it makes sense - as it helps companies be more future proof and prevent scenarios like this (link to HN thread with uproar on shutting down of [airplane.dev](http://airplane.dev) as they now have to find a new solution)

As a founder and maintainer of an opentelemetry native project (SigNoz) we are part of lots of users and customers trying to implement opentelemetry in the wild. I thought to sit down, and note what is the current state of opentelemetry as we exit 2023 and enter 2024. 

We also run OTEL APAC end user group meetup.

Some top line figures:

- Enterprise scale companies like Ebay(link), Canva(link?) are moving to OpenTelemetry
- People are able to handle huge scale with OpenTelemetry. Even with our personal experience with SigNoz customers and users we have seen users easily send order of ~10-50TB/day logs and traces via opentelemetry SDKs and collectors and it scales seamlessly.
- Logs was announced to be GA in Kubecon NA 2023 (Nov 2023) which marks a big step for the project. Many organizations start their journey with observability with logs and this would help more companies adopt otel at scale.

### Learnings from OpenTelemetry APAC End Users meetup group

As I mentioned, we also run OpenTelemetry APAC meetup group. Some of the key themes users have:

1. How to setup opentelemetry at scale: The current otel documentation have focus on sending logs/traces/metrics data from individual application to the a backend. But when someone is deploying opentelemetry in their organizations - they need understanding of what are best practices to deploy it. e.g. 
    1. Should you send data directly to the o11y backend or via an otel collector 
    2. How many instances of otel-collectors should be run to handle their scale
    3. Should telemetry data be sent directly to otel collector or should there be a queueing mechanism like Kafka infront ( link to our Kafka article)
    4. How should otel collector be deployed in a k8s environments? What are the tradeoffs between having it as a daemonset/sidecar etc.
2. Once the applications are instrumented the next question is how to optimise between the value generated and cost involved. Generally, people want to implement some sort of filtering mechanism of logs (e.g excluding healthcheck end points) or do sampling for traces. Esp. for tail based sampling (insert link) for traces people have lots of questions around how to do it correctly.
3. Since Opentelemetry is still a new-ish project, people need more help in evangelising it in their org. Questions like what are the advantages compared to current solution, as introducing OpenTelemetry is an org wide change in how people are doing observability. It would need buyin from multiple stake holders with their own concerns and vantage points. 

As a community, we need to publish more success stories of organizations becoming successful with otel and how they achieved it.

Other common themes of questions were not being able to understand that otel is just focused on getting telemetry data and you still need a backend/visualization tool to get insight from this data. (link to Jaeger vs OpenTelemetry video)

### Learnings from SigNoz users and customers

As we encounter many users and customers using SigNoz as the backend and visualization layer for OpenTelemetry data, we see lots of interesting use cases for opentelemetry. Some of the use cases powered by Otel which we find SigNoz users love a lot are:

1. Leveraging open telemetry semantic conventions.
    1. At SigNoz, we deeply leverage otel semantic conventions for showing views which would need be possible in non-otel native products. e.g. Something which many of our users and customers like a lot is the exceptions monitoring view created directly from traces data.
    2. Linking traces and logs is more easily possible by inserting and using `traceid` fields in logs to show related logs to traces. This helps in correlating logs and traces easily and debugging issues faster.
2. Since Opentelemetry semantic conventions are GA, users are very comfortable doing manual instrumentation for parts of code which don’t get automatically instrumented. Being an open standard, they have the guarantee that any other backend vendor they choose will also support these manual instrumentations by default,
3. Switching to new tools becomes very easy : We had an interesting incident where teams sending TBs of data per day are able to change observability backend in a matter of few minutes as their code was already instrumented with otel and the new backend also supported otel. This is only possible because of the open source standards which otel has developed. Otherwise just changing the observability backend would have been a 3 month project taking a lot of bandwidth from the team.
4. We see many teams being comfortable with spending the time to learn Otel fundamentals, as they know once their teams gets understanding of the basics they can use any vendors which support otel and the basic constructs will remain same. This is very different from the earlier era where each tool would have their own proprietary conventions and changing backends would mean retraining the whole team
5. We have seen many customers use `filterprocessor` in otel collector to optimise their metrics cost. This had been pretty seamless and gives better control to users on which metrics to parse. Also, otel collector gives more controls on metrics and spans they want to send. For example you can choose which type of metrics you want to send for `hostmetrics` receiver. Most proprietary agents don’t give this flexibility to users.
    
    Better control: We have seen customers use include and exclude instrumentation of Java classes using [annotation](https://opentelemetry.io/docs/instrumentation/java/automatic/annotations/) very easily.
    
6. [Voltron Data] Use trace data to test performance of their system to periodically test the end to end flow of the data and analyse performance. People who deeply instrument and enable it. for performance analysis only for specific time when they want to do performance testing
7. Open source products have support for emitting telemetry data in OTLP format so that it can be used to better understand their performance. Some examples of such projects are [ClickHouse](https://clickhouse.com/docs/en/operations/opentelemetry#tracing-the-clickhouse-itself), [Hasura](https://hasura.io/docs/latest/observability/opentelemetry/), [Traefik](https://doc.traefik.io/traefik/master/observability/tracing/opentelemetry/), etc.
8. ~~Using Otel Opamp framework for logs pipeline~~

### What was achieved in OpenTelemetry in 2023?

- **Logs becoming GA** - This was announced in Kubecon
- **New tools coming up leveraging OpenTelemetry data format** - Tools like Tracetest, Traceloop & OpenLLMetry were released which leverage common data. We think the standardization of data formats will lead to an ecosystem of tools which go beyond observability into other areas like testing, performance, security, etc.
- Stable release of the Metrics [API](https://github.com/open-telemetry/opentelemetry-go/blob/main/CHANGELOG.md#11600390-2023-05-18) and [SDK](https://github.com/open-telemetry/opentelemetry-go/blob/main/CHANGELOG.md#11900420007-2023-09-28) in the Go implementation.
- OPAMP - [Open Agent Management Protocol](https://github.com/open-telemetry/opamp-spec) (OpAMP) is a network protocol for remote management of large fleets of data collection Agents. The spec is currently in Beta stage but lots of progress was made in 2023 to make it ready for production usage. As mentioned above, we at SigNoz also have leveraged it to make logs pipelines.

### Things we are most excited about in OpenTelemetry in 2024

1. **New Repo for Profiling** - A [new repo](https://github.com/open-telemetry/opentelemetry-proto-profile/pull/3) for profiling was created with details like the vision doc and some example code. The progress seems to be a bit slow with last PR merged ~4 months back, but it would be exciting to have profiling added as a signal in Otel so that it could be easily correlated with metrics, traces and logs.
2. **Query Standardization working group** - There is a [WG under TAG observability](https://github.com/cncf/tag-observability/blob/main/working-groups/query-standardization.md) in CNCF which is working on query standardization. This is not specifically under OpenTelemetry project, as the scope of Otel is confined to generating telemetry data - but how this working group progesses would be interesting to see. If successful, this would help standardize the query language different observability backends use for creating dashboards and alerts, and potentially enable porting of queries across backends.
3. **CI/CD Observability working group** - The [OpenTelemetry proposal](https://www.notion.so/Context-Propagation-in-Open-Telemetry-36b51e86c524418e8b2cf3590e5ee1c5?pvs=21) focuses on enhancing CI/CD observability by establishing standard semantic conventions for telemetry data from CI/CD tools. This initiative aims to reduce the Lead Time for Changes, a critical DevOps metric. It suggests a four-stage observability process: Collect, Store, Visualize, and Alert, with OpenTelemetry providing a unified approach for data collection.
4. **OpenTelemetry Protocol with Apache Arrow**  - There has been [some efforts](https://opentelemetry.io/blog/2023/otel-arrow/) in Opentelemetry community to include Apache Arrow as the data format for OTLP. This integration facilitates a reduction in telemetry data traffic by a factor of 10 after compression, offering a 40% improvement over the best existing OpenTelemetry Protocol (OTLP) configurations with [Zstandard (zstd)](http://www.zstd.net/) compression enabled. As a result, this new protocol emerges as an optimal choice for transporting telemetry data over the internet. This project is currently in [Beta stage](https://github.com/open-telemetry/otel-arrow?tab=readme-ov-file) with some active development happening.
5. **OpenTelemetry Transform Language  (OTTL)** - The OpenTelemetry Collector is a convenient place to transform data before sending it to a vendor or other systems. This is frequently done for data quality, governance, cost, and security reasons.
    
Processors available [i](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor)n Otel Collector support dozens of different transformations on metric, span and log data. The [OTTL](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/README.md) is a language for transforming open telemetry data. This will help users in writing  processing operations in a SQL like declarative language in `transform` processor rather than specific syntaxes.