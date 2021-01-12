#!/usr/sbin/dtrace -s

#pragma D option quiet

pid$target:WeChat:__xlogger_Write_impl:entry
{
    printf("%s\n", copyinstr(arg1));
}

/*
 * Set the global variable `gs_level' in xloggerbase.c to zero, so that
 * `xlogger_Level()' always return zero, enabling DEBUG level messages.
 *
 * TODO:
 *   0. Make this work.
 *   1. Restore `gs_level' on exit with an `END' block'.
 *   2. Decode the current instruction instead of hardcoding the offset.
 *
 *     BEGIN
 *     {
 *         zero = (int *) alloca(4);
 *         *zero = 0;
 *     }
 *     
 *     pid$target:WeChat:__xlogger_Level_impl:entry
 *     {
 *         gs_level_addr = uregs[R_PC] + 0x1a414d6 + 10;
 *         printf("gs_level: %d", *((int *) copyin(gs_level_addr, 4)));
 *         copyout(zero, gs_level_addr, 4);
 *         printf(" -> %d\n", *((int *) copyin(gs_level_addr, 4)));
 *     }
 */

