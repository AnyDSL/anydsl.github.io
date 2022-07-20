---
title: AnyDSL Workshop 2022
menu: Workshop 2022
weight: 1 # [optional] may define the order of entries in the navigation tree
---
[AnyDSL](https://anydsl.github.io) is a framework to develop high-performance code for heterogeneous systems (CPUs with vector instructions, GPUs, FPGAs).
The DSL in AnyDSL stands for **domain-specific langauge** or **library**.
This is because AnyDSL facilitates an approach to DSL embedding called **shallow embedding** using **partial evaluation**.

Shallow embeddings allow the programmer to create domain-specific languages **as libraries** in AnyDSL's host language Impala.
This means that you can harvest the performance that a custom domain-specific language and compiler would give you without actually having to implement that compiler.
Since DSLs are essentially implemented in Impala, all DSLs benefit from new features in the AnyDSL compiler infrastructure.

In the recent years we have developed a wide range of high-performance codes using AnyDSL (from image processing and [ray tracing](https://graphics.cg.uni-saarland.de/papers/perard-2019-siggraph-rodent.pdf) to [genome sequence alignment](https://arxiv.org/pdf/2002.04561.pdf)) and have demonstrated that using AnyDSL, we can:

* compile these applications from a shared code base to heterogeneous systems including CPUs, AMD and NVIDIA GPUs, and Xilinx and Altera FPGAs.
* achieve similar, sometimes even better performance than manually-tuned expert codes that belong to the best performing codes available
* create these codes with less effort because AnyDSL allows for factoring out architecture-dependent code using standard abstraction techniques whose overhead can be succinctly removed using AnyDSL's partial evaluator.

In this workshop, we will:

* give an overview of AnyDSL and demonstrate how DSLs can be implemented in AnyDSL by means of a simple example.
* give an overview of our recent work including a [novel record-setting sequence alignment DSL](https://arxiv.org/abs/2205.07610) specifically targeted at GPUs, integration of automatic differentiation into the AnyDSL tool chain, and denoising in Rodent, a high-performance ray tracer written in AnyDSL.

## Speakers

* [Sebastian Hack](https://compilers.cs.uni-saarland.de/people/hack/) (Uni Saarland)
* [Roland Leißa](https://www.wim.uni-mannheim.de/leissa/) (Uni Mannheim)
* [Richard Membarth](https://www.thi.de/suche/mitarbeiter/prof-dr-richard-membarth/) (Technische Hochschule Ingolstadt)
* [André Müller](https://www.hpc.informatik.uni-mainz.de/people/andre-mueller/) (Uni Mainz)
* [Bertil Schmidt](https://www.hpc.informatik.uni-mainz.de/people/bertil-schmidt/) (Uni Mainz)
* [Marcel Ullrich](https://compilers.cs.uni-saarland.de/people/ullrich/) (Uni Saarland)

## Where and When

* 21 July 2022 14:00-17:00 CEST
* Via [Zoom](https://cs-uni-saarland-de.zoom.us/j/88467388643?pwd=OExnaldrR0NlU3haMTNKQ0xraXVkQT09)

## Agenda

14:00 – 14:05: Welcome  
14:05 – 15:00: Introduction to the AnyDSL Framework (Roland & Sebastian)  
15:00 – 15:30: Automatic Differentiation for Machine Learning (Marcel & Sebastian)  
15:30 – 16:00: Denoising for Ray Tracing with AnyDSL (Richard)  
16:00 – 16:30: Bioinformatics with AnyDSL (André & Bertil)  
16:30 – 17:00: Q&A and Discussion  


