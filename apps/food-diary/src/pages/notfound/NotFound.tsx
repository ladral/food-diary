"use client";

import { motion, AnimatePresence } from "motion/react";
import React from "react";
import { Variants } from "motion";
import styles from './NotFound.module.scss';


const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 }
            }
        };
    }
};


const NotFound: React.FC = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.svgContainer}>
                <motion.svg
                    viewBox="0 0 605 200"
                    initial="hidden"
                    animate="visible"
                    className={styles.svg}
                >
                    {/* Letter N */}
                    <motion.path
                        d="M 10 150 L 10 50 L 60 150 L 60 50"
                        variants={draw}
                        custom={1}
                        className={`${styles.shape} ${styles.shapePrimary}`}
                    />
                    {/* Letter O */}
                    <motion.path
                        d="M 80 100 C 80 50, 140 50, 140 100 C 140 150, 80 150, 80 100"
                        variants={draw}
                        custom={2}
                        className={`${styles.shape} ${styles.shapeSecondary}`}
                    />
                    {/* Letter T */}
                    <motion.path
                        d="M 170 50 L 170 150 M 120 50 L 220 50"
                        variants={draw}
                        custom={1}
                        className={`${styles.shape} ${styles.shapePrimary}`}
                    />
                    {/* Letter F */}
                    <motion.path
                        d="M 270 50 L 270 150 M 270 50 L 320 50 M 270 100 L 320 100"
                        variants={draw}
                        custom={1}
                        className={`${styles.shape} ${styles.shapePrimary}`}
                    />
                    {/* Letter O */}
                    <motion.path
                        d="M 340 100 C 340 50, 400 50, 400 100 C 400 150, 340 150, 340 100"
                        variants={draw}
                        custom={2}
                        className={`${styles.shape} ${styles.shapeSecondary}`}
                    />
                    {/* Letter U */}
                    <motion.path
                        d="M 420 65 L 420 115 C 420 145, 460 145, 460 115 L 460 65"
                        variants={draw}
                        custom={2}
                        className={`${styles.shape} ${styles.shapeSecondary}`}
                    />
                    {/* Letter N */}
                    <motion.path
                        d="M 480 142 L 480 65 L 520 142 L 520 65"
                        variants={draw}
                        custom={1}
                        className={`${styles.shape} ${styles.shapeSecondary}`}
                    />
                    {/* Letter D */}
                    <motion.path
                        d="M 550 50 L 540 50 540 150 L 550 150 C 610 150, 610 50, 550 50"
                        variants={draw}
                        custom={1}
                        className={`${styles.shape} ${styles.shapePrimary}`}
                    />
                </motion.svg>


                <AnimatePresence initial={true}>
                    {<motion.div key="modal"
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 transition={{ duration: 2 }}
                    >Oops! Diese Seite existiert nicht.</motion.div>}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotFound;
