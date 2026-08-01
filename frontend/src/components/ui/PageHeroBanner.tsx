"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroBannerProps {
  /** Path to image inside /public, e.g. "/banners/contact-banner.jpg" */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Small label above the title (e.g. "SUPPORT CENTER") */
  label?: string;
  /** Main page heading */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Height of the banner in px (default 440) */
  height?: number;
  /** Background color of page below banner (for torn paper fill) */
  paperColor?: string;
}

export default function PageHeroBanner({
  imageSrc,
  imageAlt = "Page Banner",
  label,
  title,
  subtitle,
  height = 440,
  paperColor = "#ffffff",
}: PageHeroBannerProps) {
  return (
    <div
      className="relative w-full"
      style={{ marginBottom: "-2px" }}
    >
      {/* ── Photo container ── */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        {/* Background Image */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Soft dark overlay — lighter at top, darker at bottom so text pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55" />

        {/* Text content — sits in upper-centre, above the torn paper */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
          style={{ paddingBottom: "80px" }} // push text up away from torn area
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="flex flex-col items-center gap-3"
          >
            {label && (
              <span
                className="text-[11px] uppercase tracking-[0.35em] font-bold font-space"
                style={{ color: "#C5A880", letterSpacing: "0.3em" }}
              >
                {label}
              </span>
            )}
            <h1
              className="font-space font-bold uppercase text-white"
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                letterSpacing: "0.06em",
                textShadow: "0 2px 24px rgba(0,0,0,0.65)",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-slate-100 font-sans text-sm md:text-[15px] max-w-lg leading-relaxed mt-1"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Torn paper edge — sits BELOW the image box, overlapping it upward ── */}
      <div
        className="relative w-full z-20 pointer-events-none"
        style={{ marginTop: "-110px", lineHeight: 0 }}
      >
        <svg
          viewBox="0 0 1440 130"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
          style={{ display: "block", height: "130px" }}
        >
          {/*
            Highly irregular torn paper path — mimics real paper tearing:
            - Large random peaks and valleys
            - Small micro-tears between main peaks
            - Some sections nearly flat, others spike sharply
          */}
          <path
            d={`
              M0,130 L0,95
              L8,88 L14,93 L20,82 L28,90 L34,78
              L40,85 L46,70 L53,80 L58,65
              L64,75 L70,58 L77,70 L82,55
              L88,68 L95,50 L100,63 L106,46
              L112,60 L118,42 L125,57 L130,40
              L137,54 L143,38 L150,52 L155,35
              L162,50 L168,32 L175,47 L180,28
              L187,44 L193,26 L200,42 L205,24
              L212,40 L218,22 L225,38 L230,20
              L237,36 L244,18 L250,34 L256,16
              L262,30 L268,14 L275,28 L280,12
              L287,26 L294,10 L300,24 L306,8
              L312,22 L318,7 L325,20 L330,6
              L337,18 L344,5 L350,16 L356,4
              L362,15 L368,3 L375,13 L380,3
              L387,12 L394,2 L400,11 L406,2
              L413,10 L420,1 L426,9 L432,2
              L439,8 L446,1 L452,7 L458,2
              L465,7 L472,1 L478,6 L484,2
              L490,6 L497,1 L504,5 L510,1
              L516,4 L523,0 L530,4 L536,1
              L543,4 L550,0 L556,3 L562,1
              L568,3 L575,0 L582,3 L588,1
              L594,3 L600,0 L607,3 L614,0
              L620,2 L626,0 L633,2 L640,0
              L647,3 L654,0 L660,2 L666,0
              L673,4 L680,1 L686,4 L692,1
              L699,5 L706,2 L712,5 L718,2
              L725,6 L732,2 L738,6 L745,2
              L751,7 L758,3 L764,7 L771,3
              L777,8 L784,4 L790,9 L796,4
              L803,10 L810,5 L816,11 L823,5
              L829,12 L836,6 L843,13 L849,7
              L856,15 L863,8 L869,16 L876,9
              L882,18 L889,10 L896,20 L902,12
              L909,22 L916,14 L922,24 L929,16
              L935,26 L942,18 L949,28 L955,20
              L962,32 L969,22 L975,34 L982,24
              L988,36 L995,26 L1002,38 L1008,28
              L1015,42 L1022,30 L1028,45 L1035,32
              L1042,48 L1048,35 L1055,51 L1062,38
              L1068,54 L1075,40 L1082,56 L1089,42
              L1096,58 L1102,44 L1109,60 L1116,46
              L1122,64 L1130,50 L1136,68 L1143,54
              L1150,72 L1156,58 L1163,75 L1170,62
              L1176,78 L1183,65 L1190,80 L1197,68
              L1204,84 L1210,72 L1217,86 L1224,74
              L1230,88 L1237,76 L1244,90 L1250,80
              L1257,93 L1264,84 L1270,96 L1277,88
              L1284,98 L1290,92 L1297,100 L1304,95
              L1310,102 L1317,98 L1324,104 L1330,100
              L1337,106 L1344,103 L1350,108 L1357,105
              L1363,110 L1370,108 L1377,112 L1384,110
              L1390,115 L1397,114 L1404,118 L1410,117
              L1418,120 L1424,120 L1430,122 L1437,122
              L1440,123 L1440,130 Z
            `}
            fill={paperColor}
          />
        </svg>
      </div>
    </div>
  );
}
